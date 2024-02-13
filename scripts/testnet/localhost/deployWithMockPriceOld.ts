/**
 * This file is for bootstrapping a testing environment that's as complete as possible.
 * Note that this is intended for integration tests. For unit tests, you are recommended
 * to use mocks etc. to isolate the module under test.
 */

import { Duration } from "luxon"
import { ethers, upgrades } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { expandTo18Decimals, zeroAddress } from "../../../test/utilities"
import { formatBytes32String } from "ethers/lib/utils"
import {
  AccessControl,
  AssetSystem,
  AssetUpgradeable,
  AssetUpgradeable__factory,
  BuildBurnSystem,
  CollateralSystem,
  Config,
  DebtSystem,
  ExchangeSystem,
  IronForgeToken,
  LinearRelease,
  Liquidation,
  MinerReward,
  MockERC20,
  MockPrices,
  PancakeFactory,
  PancakePair,
  PancakeRouterV2,
  PublicCatalystMath,
  RewardSystem,
  Timelock__factory,
} from "../../../typechain"
import { DeployedStackResult } from "../deployParamTypes"
import { settings } from "./settings.localhost"
import { setBuildTokensInCollateral } from "../common/setBuildTokensInCollateral"
import { logger } from "../../utilities/log"
import { createSyntheticAssets } from "../common/createSyntheticAssets"
import { LibDeployer } from "../../common/LibDeployer"
import { TokensDeployer } from "../common/TokensDeployer"
import { LpTokenBstUsdcDeployer } from "../common/LpTokenBstUsdcDeployer"
import { AssetSystemDeployer } from "../../common/AssetSystemDeployer"

export async function deployWithMockPrice(
  deployer: SignerWithAddress,
  admin: SignerWithAddress
): Promise<DeployedStackResult> {
  // Disable OpenZepplin upgrade warnings for test runs
  upgrades.silenceWarnings()
  let output: Record<string, any> = {}
  let outputContracts: Record<string, any> = {}

  /**
   * Reusable SafeDecimalMath library. Contracts that depend on it must link
   * to it first before being deployed.
   */
  const deployLib = new LibDeployer(deployer, output, outputContracts)
  const { catalystMath, safeDecimalMath } = await deployLib.deploy()

  const tokensDeployer = new TokensDeployer(deployer, output, outputContracts)
  const tokens = await tokensDeployer.deploy()
  const platformToken = tokens.platformToken as IronForgeToken
  const usdcToken = tokens.usdcToken as MockERC20
  const btcToken = tokens.btcToken as MockERC20
  const ethToken = tokens.ethToken as MockERC20
  const usdtToken = tokens.usdtToken as MockERC20

  const lpTokenBSTUsdcDeployer = new LpTokenBstUsdcDeployer(deployer, output, outputContracts)
  const lps = await lpTokenBSTUsdcDeployer.deploy()
  const pancakeRouter = lps.pancakeRouter as PancakeRouterV2
  const pancakeFactory = lps.pancakeFactory as PancakeFactory
  const lp = lps["USDC-BST"] as PancakePair

  output = lpTokenBSTUsdcDeployer.output

  const assetSystemDeployer = new AssetSystemDeployer(deployer, output, outputContracts)
  await assetSystemDeployer.deploy()
  const assetSystem = outputContracts.assetSystem

  // Load contract factories without external libraries
  const [
    AccessControlFactory,
    AssetUpgradeableFactory,
    ConfigFactory,
    RewardSystemFactory,
    MinerRewardFactory,
    LinearReleaseFactory,
  ] = await Promise.all(
    ["AccessControl", "AssetUpgradeable", "Config", "RewardSystem", "MinerReward", "LinearRelease"].map(
      (contractName) => ethers.getContractFactory(contractName, deployer)
    )
  )

  // Load contract factories with external libraries
  const [
    CollateralSystemFactory,
    BuildBurnSystemFactory,
    MockPricesFactory,
    DebtSystemFactory,
    ExchangeSystemFactory,
    LiquidationFactory,
  ] = await Promise.all(
    ["CollateralSystem", "BuildBurnSystem", "MockPrices", "DebtSystem", "ExchangeSystem", "Liquidation"].map(
      (contractName) =>
        ethers.getContractFactory(contractName, {
          signer: deployer,
          libraries: {
            "contracts/libs/SafeDecimalMath.sol:SafeDecimalMath": safeDecimalMath.address,
          },
        })
    )
  )

  const [PublicCatalystMathFactory] = await Promise.all(
    ["PublicCatalystMath"].map((contractName) =>
      ethers.getContractFactory(contractName, {
        signer: deployer,
        libraries: {
          "contracts/libs/CatalystMath.sol:CatalystMath": catalystMath.address,
        },
      })
    )
  )

  const publicCatalystMath = (await PublicCatalystMathFactory.deploy()) as PublicCatalystMath

  /**
   * The contract for controlling issuance and burning of synthetic assets
   */
  const buildBurnSystem = (await upgrades.deployProxy(
    BuildBurnSystemFactory,
    [
      admin.address, // admin
      zeroAddress, // _FUSDTokenAddr
    ],
    {
      initializer: "initialize",
      unsafeAllowLinkedLibraries: true,
    }
  )) as BuildBurnSystem
  logger.info("BuildBurnSystem proxy deployed to:", buildBurnSystem.address)
  output.BuildBurnSystem = buildBurnSystem.address
  /**
   * A contract for storing configuration values
   */
  const config = (await upgrades.deployProxy(ConfigFactory, [], {
    initializer: "initialize",
  })) as Config
  logger.info("Config proxy deployed to:", config.address)
  output.Config = config.address

  /**
   * A contract for role-based access control
   */
  const accessControl = (await upgrades.deployProxy(
    AccessControlFactory,
    [
      admin.address, // admin
    ],
    {
      initializer: "initialize",
    }
  )) as AccessControl
  logger.info("AccessControl proxy deployed to:", accessControl.address)
  output.AccessControl = accessControl.address

  /**
   * Oracle contract for price data access
   */
  const prices = (await MockPricesFactory.deploy(
    Duration.fromObject({ hours: 12 }).as("seconds") // _stalePeriod
  )) as MockPrices
  logger.info("Prices deployed to:", prices.address)
  output.Prices = prices.address

  const debtSystem = (await upgrades.deployProxy(DebtSystemFactory, [admin.address], {
    initializer: "initialize",
    unsafeAllowLinkedLibraries: true,
  })) as DebtSystem
  logger.info("DebtSystem proxy deployed to:", debtSystem.address)
  output.DebtSystem = debtSystem.address

  const tokenSynths = await createSyntheticAssets(
    <AssetUpgradeable__factory>AssetUpgradeableFactory,
    admin,
    output,
    assetSystem,
    buildBurnSystem,
    config,
    accessControl
  )

  const fusdToken = <AssetUpgradeable>tokenSynths.get("FUSD")
  const lbtcToken = <AssetUpgradeable>tokenSynths.get("lBTC")
  const lEthToken = <AssetUpgradeable>tokenSynths.get("lETH")
  const lbtcToken202112 = <AssetUpgradeable>tokenSynths.get("lBTCUSD_211231")

  const collateralSystem = (await upgrades.deployProxy(
    CollateralSystemFactory,
    [
      admin.address, // admin
      fusdToken.address,
    ],
    {
      initializer: "initialize",
      unsafeAllowLinkedLibraries: true,
    }
  )) as CollateralSystem
  logger.info("CollateralSystem proxy deployed to:", collateralSystem.address)
  output.CollateralSystem = collateralSystem.address
  await setBuildTokensInCollateral(admin, collateralSystem, output)

  const exchangeSystem = (await upgrades.deployProxy(
    ExchangeSystemFactory,
    [
      admin.address, // _admin
    ],
    {
      initializer: "initialize",
      unsafeAllowLinkedLibraries: true,
    }
  )) as ExchangeSystem
  logger.info("ExchangeSystem proxy deployed to:", exchangeSystem.address)
  output.ExchangeSystem = exchangeSystem.address

  const liquidation = (await upgrades.deployProxy(
    LiquidationFactory,
    [
      buildBurnSystem.address, // _BuildBurnSystem
      collateralSystem.address, // _CollateralSystem
      config.address, // _Config
      debtSystem.address, // _DebtSystem
      prices.address, // _Prices
      admin.address, // _admin
    ],
    {
      initializer: "initialize",
      unsafeAllowLinkedLibraries: true,
    }
  )) as Liquidation
  logger.info("Liquidation proxy deployed to:", liquidation.address)
  output.Liquidation = liquidation.address

  /**
   * Set config items:
   *
   * - BuildRatio: 0.2
   * - LiquidationRatio: 0.5
   * - LiquidationMarkerReward: 0.05
   * - LiquidationLiquidatorReward: 0.1
   * - LiquidationDelay: 3 days
   */

  logger.info("Set buildTokens config items")
  for (const c of settings.buildTokens) {
    await config.connect(admin).setBuildRatio(
      ethers.utils.formatBytes32String(c.key), // key
      c.buildRatio // value
    )
  }

  logger.info("Set config items")
  for (const c of settings.config) {
    await config.connect(admin).setUint(
      ethers.utils.formatBytes32String(c.key), // key
      c.value // value
    )
  }

  logger.info("Assign the following roles to contract `BuildBurnSystem`")

  /**
   * Assign the following roles to contract `BuildBurnSystem`:
   * - ISSUE_ASSET
   * - BURN_ASSET
   * - DebtSystem
   */
  await accessControl.connect(admin).SetIssueAssetRole([buildBurnSystem.address], [true])
  await accessControl.connect(admin).SetBurnAssetRole([buildBurnSystem.address], [true])
  await accessControl.connect(admin).SetDebtSystemRole([buildBurnSystem.address], [true])

  logger.info("Assign the following roles to contract `ExchangeSystem`")

  /**
   * Assign the following roles to contract `ExchangeSystem`:
   * - ISSUE_ASSET
   * - BURN_ASSET
   * - MOVE_ASSET
   */
  await accessControl.connect(admin).SetIssueAssetRole([exchangeSystem.address], [true])
  await accessControl.connect(admin).SetBurnAssetRole([exchangeSystem.address], [true])

  logger.info("Assign the following role to contract `Liquidation`")

  /**
   * Assign the following role to contract `Liquidation`:
   * - MOVE_REWARD
   */
  await accessControl.connect(admin).SetRoles(
    formatBytes32String("MOVE_REWARD"), // roleType
    [liquidation.address], // addresses
    [true] // setTo
  )

  logger.info("Fill the contract address registry")

  /**
   * Fill the contract address registry
   */
  await assetSystem
    .connect(admin)
    .updateAll(
      [
        ethers.utils.formatBytes32String("AssetSystem"),
        ethers.utils.formatBytes32String("AccessControl"),
        ethers.utils.formatBytes32String("Config"),
        ethers.utils.formatBytes32String("Prices"),
        ethers.utils.formatBytes32String("DebtSystem"),
        ethers.utils.formatBytes32String("CollateralSystem"),
        ethers.utils.formatBytes32String("BuildBurnSystem"),
        ethers.utils.formatBytes32String("ExchangeSystem"),
        ethers.utils.formatBytes32String("Liquidation"),
        ethers.utils.formatBytes32String("PublicCatalystMath"),
        ethers.utils.formatBytes32String("PlatformToken"),
      ],
      [
        assetSystem.address,
        accessControl.address,
        config.address,
        prices.address,
        debtSystem.address,
        collateralSystem.address,
        buildBurnSystem.address,
        exchangeSystem.address,
        liquidation.address,
        publicCatalystMath.address,
        platformToken.address,
      ]
    )

  logger.info("Synchronize contract address cache")

  /**
   * Synchronize contract address cache
   */
  logger.info("Updating BuildBurnSystem address cache...")
  await buildBurnSystem.connect(admin).updateAddressCache(assetSystem.address)
  // logger.info("Updating CollateralSystem address cache...")
  // await collateralSystem.connect(admin).updateAddressCache(assetSystem.address)
  logger.info("Updating DebtSystem address cache...")
  await debtSystem.connect(admin).updateAddressCache(assetSystem.address)

  logger.info("Update synth address cache")

  /**
   * Update synth address cache
   */
  await fusdToken.connect(admin).updateAddressCache(assetSystem.address)
  await lbtcToken.connect(admin).updateAddressCache(assetSystem.address)
  await lbtcToken202112.connect(admin).updateAddressCache(assetSystem.address)
  await lEthToken.connect(admin).updateAddressCache(assetSystem.address)

  logger.info("prices setPrice")

  await prices.connect(admin).setPrice(ethers.utils.formatBytes32String("BTC"), expandTo18Decimals(10000))
  await prices.connect(admin).setPrice(ethers.utils.formatBytes32String("ETH"), expandTo18Decimals(1000))
  await prices.connect(admin).setPrice(ethers.utils.formatBytes32String("lETH"), expandTo18Decimals(1000))
  await prices.connect(admin).setPrice(ethers.utils.formatBytes32String("USDT"), expandTo18Decimals(1))
  await prices.connect(admin).setPrice(ethers.utils.formatBytes32String("USDC"), expandTo18Decimals(1))
  await prices.connect(admin).setPrice(ethers.utils.formatBytes32String("FUSD"), expandTo18Decimals(1))
  await prices.connect(admin).setPrice(ethers.utils.formatBytes32String("lBTC"), expandTo18Decimals(10000))
  await prices.connect(admin).setPrice(ethers.utils.formatBytes32String("lBTC-202112"), expandTo18Decimals(10000))
  await prices.connect(admin).setPrice(ethers.utils.formatBytes32String("BST"), expandTo18Decimals(0.1))

  await prices.connect(admin).setStalePeriod(
    Duration.fromObject({ days: 7 }).as("seconds") // _stalePeriod
  )

  logger.info("A contract for distributing rewards calculated and signed off-chain.")

  /**
   * A contract for distributing rewards calculated and signed off-chain.
   */
  const rewardSystem = (await upgrades.deployProxy(
    RewardSystemFactory,
    [
      (
        await ethers.provider.getBlock("latest")
      ).timestamp, // _firstPeriodStartTime
      admin.address, // _rewardSigner
      fusdToken.address, // _fusdAddress
      collateralSystem.address, // _collateralSystemAddress
      admin.address, // _admin
    ],
    {
      initializer: "initialize",
    }
  )) as RewardSystem

  logger.info("RewardSystem proxy deployed to:", rewardSystem.address)
  output.RewardSystem = rewardSystem.address

  const minerReward = (await upgrades.deployProxy(
    MinerRewardFactory,
    [
      (
        await ethers.provider.getBlock("latest")
      ).timestamp, // _firstPeriodStartTime
      expandTo18Decimals(100), // rewardPerBlock
    ],
    {
      initializer: "initialize",
    }
  )) as MinerReward

  logger.info("MinerReward proxy deployed to:", minerReward.address)
  output.MinerReward = minerReward.address

  await minerReward.connect(admin).setExchangeRewardInfo(0, expandTo18Decimals(0.01), expandTo18Decimals(10000))

  const linearRelease = (await upgrades.deployProxy(
    LinearReleaseFactory,
    [
      platformToken.address, // reward token
      5000, // lockupBps
      10, // rewardPerBlock
      minerReward.address,
    ],
    {
      initializer: "initialize",
    }
  )) as LinearRelease

  logger.info("LinearRelease proxy deployed to:", linearRelease.address)
  output.LinearRelease = linearRelease.address

  /**
   * addPool
   */
  await minerReward.addPool(1, platformToken.address, linearRelease.address, 0)

  /**
   * Synchronize ExchangeAddress cache
   */
  await assetSystem
    .connect(admin)
    .updateAll(
      [ethers.utils.formatBytes32String("RewardSystem"), ethers.utils.formatBytes32String("MinerReward")],
      [rewardSystem.address, minerReward.address]
    )
  await exchangeSystem.connect(admin).updateAddressCache(assetSystem.address)
  await minerReward.updateAddressCache(assetSystem.address)

  /// Deploy Timelock
  const TimelockFactory = (await ethers.getContractFactory("Timelock", deployer)) as Timelock__factory
  //2 day
  const timelock = await TimelockFactory.deploy(await admin.getAddress(), "259200")
  await timelock.deployed()
  output.Timelock = timelock.address

  logger.info("Updating CollateralSystem address cache...")
  await collateralSystem.connect(admin).updateAddressCache(assetSystem.address)
  return {
    output,
    platformToken,
    usdcToken,
    btcToken,
    ethToken,
    fusdToken,
    lbtcToken,
    lEthToken,
    lbtcToken202112,
    accessControl,
    assetSystem,
    buildBurnSystem,
    prices,
    collateralSystem,
    config,
    debtSystem,
    exchangeSystem,
    rewardSystem,
    liquidation,
    pancakeRouter,
    pancakeFactory,
    lp_usdc_BST: lp,
    publicCatalystMath,
    minerReward,
    linearRelease,
    timelock,
  }
}
