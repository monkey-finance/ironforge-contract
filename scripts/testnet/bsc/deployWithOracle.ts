/**
 * This file is for bootstrapping a testing environment that's as complete as possible.
 * Note that this is intended for integration tests. For unit tests, you are recommended
 * to use mocks etc. to isolate the module under test.
 */
import { ethers, upgrades } from "hardhat"
import { testAfterDeploy } from "../delpoyTests/test"
import { logger } from "../../utilities/log"
import { LibDeployer } from "../../common/LibDeployer"
import { DeployedStackResult } from "../deployParamTypes"
import { TokensDeployer } from "../../common/TokensDeployer"
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
  OracleRouter,
  PancakeFactory,
  PancakePair,
  PancakeRouterV2,
  PublicCatalystMath,
  RewardSystem,
  Timelock,
} from "../../../typechain"
import { LpTokenBstUsdcDeployer } from "../../common/LpTokenBSTUsdcDeployer"
import { AssetSystemDeployer } from "../../common/AssetSystemDeployer"
import { CoreSystemDeployer } from "../../common/CoreSystemDeployer"
import { SyntheticsAssetsDeployer } from "../../common/SyntheticsAssetsDeployer"
import { CollateralSystemDeployer } from "../../common/CollateralSystemDeployer"
import { ChainlinkSystemDeployer } from "../../common/ChainlinkSystemDeployer"
import { QuarterlyContractDeployer } from "../../common/QuarterlyContractDeployer"
import { PlatformTokenDexDeployer } from "../../common/PlatformTokenDexDeployer"
import { LiquidationDeployer } from "../../common/LiquidationDeployer"
import { RewardSystemDeployer } from "../../common/RewardSystemDeployer"
import { MinerRewardDeployer } from "../../common/MinerRewardDeployer"
import { FinishingWorkDeployer } from "../../common/FinishingWorkDeployer"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

export async function deployWithOracle(): Promise<DeployedStackResult> {
  const [deployer] = await ethers.getSigners()
  const libDeployer = new LibDeployer(deployer)
  await libDeployer.deploy()

  const platformTokenDeployer = new TokensDeployer(deployer)
  await platformTokenDeployer.deploy()

  const assetSystemDeployer = new AssetSystemDeployer(deployer)
  await assetSystemDeployer.deploy()

  const lpTokenBSTUsdcDeployer = new LpTokenBstUsdcDeployer(deployer)
  await lpTokenBSTUsdcDeployer.deploy()

  const coreSystemDeployer = new CoreSystemDeployer(deployer)
  await coreSystemDeployer.deploy()

  const syntheticsDeployer = new SyntheticsAssetsDeployer(deployer)
  await syntheticsDeployer.deploy()

  const collateralDeployer = new CollateralSystemDeployer(deployer)
  await collateralDeployer.deploy()

  const chainLinkDeployer = new ChainlinkSystemDeployer(deployer)
  await chainLinkDeployer.deploy()

  const quarterlyContractDeployer = new QuarterlyContractDeployer(deployer)
  await quarterlyContractDeployer.deploy()

  const platformTokenDexDeployer = new PlatformTokenDexDeployer(deployer)
  await platformTokenDexDeployer.deploy()

  const liquidationDeployer = new LiquidationDeployer(deployer)
  await liquidationDeployer.deploy()

  const rewardSystemDeployer = new RewardSystemDeployer(deployer)
  await rewardSystemDeployer.deploy()

  const minerRewardDeployer = new MinerRewardDeployer(deployer)
  await minerRewardDeployer.deploy()

  const finishingDeployer = new FinishingWorkDeployer(deployer)
  await finishingDeployer.deploy()

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
    collateralSystem: collateralDeployer.outputContracts.CollateralSystem as CollateralSystem,
    liquidation: liquidationDeployer.outputContracts.Liquidation as Liquidation,
    rewardSystem: rewardSystemDeployer.outputContracts.RewardSystem as RewardSystem,
    minerReward: minerRewardDeployer.outputContracts.MinerReward as MinerReward,
    linearRelease: minerRewardDeployer.outputContracts.LinearRelease as LinearRelease,
    output: finishingDeployer.output,
    assetSystem: assetSystemDeployer.outputContracts.AssetSystem as AssetSystem,
    prices: chainLinkDeployer.outputContracts.Prices as OracleRouter,
  }

  return deployed
}
