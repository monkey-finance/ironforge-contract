import { ethers } from "hardhat"
import { DeployTemplate } from "../common/deployTemplate"
import { logger } from "../utilities/log"
import { settings } from "../bscmainnet/settings.mainnet"
import { formatBytes32String } from "ethers/lib/utils"
import BuildBurnSystemAbi from "../../abi/BuildBurnSystem.json"
import DebtSystemAbi from "../../abi/DebtSystem.json"
import QiarterlyContractOracleAbi from "../../abi/QuarterlyContractOracle.json"
import RewardSystemAbi from "../../abi/RewardSystem.json"
import MinerRewardAbi from "../../abi/MinerReward.json"
import ExchangeSystemAbi from "../../abi/ExchangeSystem.json"
import PlatformTokenAbi from "../../abi/IronForgeToken.json"
import CollateralSystemAbi from "../../abi/CollateralSystem.json"
import { expandTo18Decimals } from "../utilities"
import { settings as settingsLocal } from "../testnet/localhost/settings.localhost"

export class FinishingWorkDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer

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

    const config = ConfigFactory.attach(output.Config as string)
    const accessControl = AccessControlFactory.attach(output.AccessControl as string)
    const assetSystemFactory = await ethers.getContractFactory("AssetSystem", this.deployer)
    const assetSystem = assetSystemFactory.attach(output.AssetSystem as string)
    const buildBurnSystem = await ethers.getContractAt(BuildBurnSystemAbi, output.BuildBurnSystem as string)
    const debtSystem = await ethers.getContractAt(DebtSystemAbi, output.DebtSystem as string)
    const quarterlyContractOracle = await ethers.getContractAt(
      QiarterlyContractOracleAbi,
      output.QuarterlyContractOracle as string
    )
    const rewardSystem = await ethers.getContractAt(RewardSystemAbi, output.RewardSystem as string)
    const minerReward = await ethers.getContractAt(MinerRewardAbi, output.MinerReward as string)
    const exchangeSystem = await ethers.getContractAt(ExchangeSystemAbi, output.ExchangeSystem as string)
    const platformToken = await ethers.getContractAt(PlatformTokenAbi, output.platformToken as string)
    const collateralSystem = await ethers.getContractAt(CollateralSystemAbi, output.CollateralSystem as string)

    /**
     * Set config items:
     *
     * - BuildRatio: 0.2
     * - LiquidationRatio: 0.5
     * - LiquidationMarkerReward: 0.05
     * - LiquidationLiquidatorReward: 0.1
     * - LiquidationDelay: 3 days
     */
    const buildTokens = process.env.NODE_ENV === "hardhat" ? settingsLocal.buildTokens : settings.buildTokens

    for (const c of buildTokens) {
      await config.connect(admin).setBuildRatio(
        ethers.utils.formatBytes32String(c.key), // key
        c.buildRatio // value
      )
    }

    for (const c of settings.config) {
      await config.connect(admin).setUint(
        ethers.utils.formatBytes32String(c.key), // key
        c.value // value
      )
    }

    /**
     * Assign the following roles to contract `BuildBurnSystem`:
     * - ISSUE_ASSET
     * - BURN_ASSET
     * - DebtSystem
     */
    await accessControl.connect(admin).SetIssueAssetRole([buildBurnSystem.address], [true])
    await accessControl.connect(admin).SetBurnAssetRole([buildBurnSystem.address], [true])
    await accessControl.connect(admin).SetDebtSystemRole([buildBurnSystem.address], [true])

    /**
     * Assign the following roles to contract `ExchangeSystem`:
     * - ISSUE_ASSET
     * - BURN_ASSET
     * - MOVE_ASSET
     */
    await accessControl.connect(admin).SetIssueAssetRole([exchangeSystem.address], [true])
    await accessControl.connect(admin).SetBurnAssetRole([exchangeSystem.address], [true])
    await accessControl.connect(admin).SetRoles(
      formatBytes32String("MOVE_ASSET"), // roleType
      [exchangeSystem.address], // addresses
      [true] // setTo
    )

    /**
     * Assign the following role to contract `Liquidation`:
     * - MOVE_REWARD
     */
    await accessControl.connect(admin).SetRoles(
      formatBytes32String("MOVE_REWARD"), // roleType
      [output.Liquidation], // addresses
      [true] // setTo
    )

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
          output.Prices,
          output.DebtSystem,
          output.CollateralSystem,
          output.BuildBurnSystem,
          output.ExchangeSystem,
          output.Liquidation,
          output.publicCatalystMath,
          output.platformToken,
        ]
      )
    /**
     * Synchronize contract address cache
     */
    logger.info("Updating BuildBurnSystem address cache...")
    await buildBurnSystem.connect(admin).updateAddressCache(assetSystem.address)
    // logger.info("Updating CollateralSystem address cache...")
    // await collateralSystem.connect(admin).updateAddressCache(assetSystem.address)
    logger.info("Updating DebtSystem address cache...")
    await debtSystem.connect(admin).updateAddressCache(assetSystem.address)
    logger.info("Updating quarterlyContractOracle address cache...")
    await quarterlyContractOracle.updateAddressCache(assetSystem.address)

    // /**
    //  * Update synth address cache
    //  */
    // await fusdToken.connect(admin).updateAddressCache(assetSystem.address)
    // await lbtcToken.connect(admin).updateAddressCache(assetSystem.address)
    // await lEthToken.connect(admin).updateAddressCache(assetSystem.address)
    // await lBTCUSD_210924.connect(admin).updateAddressCache(assetSystem.address)
    // await lBTCUSD_210924.connect(admin).updateAddressCache(assetSystem.address)

    /**
     * Synchronize ExchangeAddress cache
     */
    await assetSystem
      .connect(admin)
      .updateAll(
        [ethers.utils.formatBytes32String("RewardSystem"), ethers.utils.formatBytes32String("MinerReward")],
        [rewardSystem.address, minerReward.address]
      )
    logger.info("Updating ExchangeSystem address cache...")
    await exchangeSystem.updateAddressCache(assetSystem.address)
    await minerReward.updateAddressCache(assetSystem.address)

    // transfer ownership to minerReward
    if (process.env.NODE_ENV === "main" || process.env.NODE_ENV === "test") {
      await platformToken.transferOwnership(minerReward.address)
    }

    logger.info("Updating CollateralSystem address cache...")
    await collateralSystem.connect(admin).updateAddressCache(assetSystem.address)

    //TODO set exchange reward info for first period
    await minerReward.connect(admin).setExchangeRewardInfo(0, expandTo18Decimals(0.01), expandTo18Decimals(10000))

    // /** TODO confirm
    //  * add first Pool for locked platform token
    //  */
    // await minerReward.addPool(1, platformToken.address, output.LinearRelease, 0)
    // /** TODO confirm
    //  * add poo for platform token stake pool.
    //  */
    // await minerReward.addPool(3, platformToken.address, output.LinearRelease, 0)
  }
}
