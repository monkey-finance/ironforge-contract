/**
 * This file is for bootstrapping a testing environment that's as complete as possible.
 * Note that this is intended for integration tests. For unit tests, you are recommended
 * to use mocks etc. to isolate the module under test.
 */
import { ethers, upgrades } from "hardhat"
import { Duration } from "luxon"
import { testAfterDeploy } from "../delpoyTests/test"
import { logger } from "../../utilities/log"
import { LibDeployer } from "../../common/LibDeployer"
import { DeployedStackResult } from "../deployParamTypes"
import { TokensDeployer } from "../common/TokensDeployer"
import {
  AccessControl,
  AssetSystem,
  AssetUpgradeable,
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
  OracleRouter,
  PancakeFactory,
  PancakePair,
  PancakeRouterV2,
  PublicCatalystMath,
  RewardSystem,
  Timelock,
} from "../../../typechain"
import { LpTokenBstUsdcDeployer } from "../common/LpTokenBstUsdcDeployer"
import { AssetSystemDeployer } from "../../common/AssetSystemDeployer"
import { CoreSystemDeployer } from "../../common/CoreSystemDeployer"
import { SyntheticsAssetsDeployer } from "../../common/SyntheticsAssetsDeployer"
import { CollateralSystemDeployer } from "../../common/CollateralSystemDeployer"
import { MockPricesDeployer } from "../../common/MockPricesDeployer"
import { LiquidationDeployer } from "../../common/LiquidationDeployer"
import { RewardSystemDeployer } from "../../common/RewardSystemDeployer"
import { MinerRewardDeployer } from "../../common/MinerRewardDeployer"
import { FinishingWorkDeployer } from "../../common/FinishingWorkDeployer"
import { expandTo18Decimals } from "../../utilities"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

export async function deployWithMockPrice(
  deployer: SignerWithAddress,
  admin: SignerWithAddress
): Promise<DeployedStackResult> {
  upgrades.silenceWarnings()
  let output: Record<string, any> = {}
  let outputContracts: Record<string, any> = {}

  const libDeployer = new LibDeployer(deployer, output, outputContracts)
  await libDeployer.deploy()

  const platformTokenDeployer = new TokensDeployer(deployer, output, outputContracts)
  await platformTokenDeployer.deploy()

  const assetSystemDeployer = new AssetSystemDeployer(deployer, output, outputContracts)
  await assetSystemDeployer.deploy()

  const lpTokenBSTUsdcDeployer = new LpTokenBstUsdcDeployer(deployer, output, outputContracts)
  await lpTokenBSTUsdcDeployer.deploy()

  const coreSystemDeployer = new CoreSystemDeployer(deployer, output, outputContracts)
  await coreSystemDeployer.deploy()

  const syntheticsDeployer = new SyntheticsAssetsDeployer(deployer, output, outputContracts)
  await syntheticsDeployer.deploy()

  const collateralDeployer = new CollateralSystemDeployer(deployer, output, outputContracts)
  await collateralDeployer.deploy()

  const mockPricesDeployer = new MockPricesDeployer(deployer, output, outputContracts)
  await mockPricesDeployer.deploy()

  const liquidationDeployer = new LiquidationDeployer(deployer, output, outputContracts)
  await liquidationDeployer.deploy()

  const rewardSystemDeployer = new RewardSystemDeployer(deployer, output, outputContracts)
  await rewardSystemDeployer.deploy()

  const minerRewardDeployer = new MinerRewardDeployer(deployer, output, outputContracts)
  await minerRewardDeployer.deploy()

  const finishingDeployer = new FinishingWorkDeployer(deployer, output, outputContracts)
  await finishingDeployer.deploy()

  logger.info("prices setPrice")
  const prices = mockPricesDeployer.outputContracts.Prices as MockPrices

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

  const _minerReward = minerRewardDeployer.outputContracts.MinerReward as MinerReward
  const poolLength = await _minerReward.poolLength()
  console.log("poolLength: ", poolLength)

  const deployed: DeployedStackResult = {
    usdcToken: platformTokenDeployer.outputContracts.usdcToken as MockERC20,
    btcToken: platformTokenDeployer.outputContracts.btcToken as MockERC20,
    ethToken: platformTokenDeployer.outputContracts.ethToken as MockERC20,
    platformToken: platformTokenDeployer.outputContracts.platformToken as IronForgeToken,
    lp_usdc_BST: lpTokenBSTUsdcDeployer.outputContracts["USDC-BST"] as PancakePair,
    pancakeRouter: lpTokenBSTUsdcDeployer.outputContracts.pancakeRouter as PancakeRouterV2,
    pancakeFactory: lpTokenBSTUsdcDeployer.outputContracts.pancakeFactory as PancakeFactory,
    publicCatalystMath: coreSystemDeployer.outputContracts.publicCatalystMath as PublicCatalystMath,
    buildBurnSystem: coreSystemDeployer.outputContracts.BuildBurnSystem as BuildBurnSystem,
    accessControl: coreSystemDeployer.outputContracts.AccessControl as AccessControl,
    debtSystem: coreSystemDeployer.outputContracts.DebtSystem as DebtSystem,
    config: coreSystemDeployer.outputContracts.Config as Config,
    exchangeSystem: coreSystemDeployer.outputContracts.ExchangeSystem as ExchangeSystem,
    timelock: coreSystemDeployer.outputContracts.TimeLock as Timelock,
    fusdToken: syntheticsDeployer.outputContracts.FUSD as AssetUpgradeable,
    lbtcToken: syntheticsDeployer.outputContracts.lBTC as AssetUpgradeable,
    lEthToken: syntheticsDeployer.outputContracts.lETH as AssetUpgradeable,
    lbtcToken202112: syntheticsDeployer.outputContracts.lBTCUSD_211231 as AssetUpgradeable,
    collateralSystem: collateralDeployer.outputContracts.CollateralSystem as CollateralSystem,
    liquidation: liquidationDeployer.outputContracts.Liquidation as Liquidation,
    rewardSystem: rewardSystemDeployer.outputContracts.RewardSystem as RewardSystem,
    minerReward: minerRewardDeployer.outputContracts.MinerReward as MinerReward,
    linearRelease: minerRewardDeployer.outputContracts.LinearRelease as LinearRelease,
    output: finishingDeployer.output,
    assetSystem: assetSystemDeployer.outputContracts.AssetSystem as AssetSystem,
    prices,
  }
  //   console.log(deployed)
  return deployed
}
