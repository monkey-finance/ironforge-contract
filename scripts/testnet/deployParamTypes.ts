import {
  AccessControl,
  AssetSystem,
  AssetUpgradeable,
  BuildBurnSystem,
  CollateralSystem,
  Config,
  DebtSystem,
  ExchangeSystem,
  IPrices,
  IronForgeToken,
  LinearRelease,
  Liquidation,
  MinerReward,
  MockERC20,
  MockPrices,
  OracleRouter,
  PancakeFactory,
  PancakeOracle,
  PancakePair,
  PancakeRouterV2,
  PublicCatalystMath,
  RewardSystem,
  Timelock,
} from "../../typechain"

export interface DeployDexOracleParams {
  oracleRouter: OracleRouter
  pancakeRouter: PancakeRouterV2
  platformToken: IronForgeToken
  usdcToken: MockERC20
  output: Record<string, any>
}

export interface DeployedStackResult {
  output: Record<string, any>
  platformToken: IronForgeToken
  usdcToken: MockERC20
  btcToken: MockERC20
  ethToken: MockERC20
  fusdToken: AssetUpgradeable
  lbtcToken: AssetUpgradeable
  lEthToken: AssetUpgradeable
  lbtcToken202112?: AssetUpgradeable
  accessControl: AccessControl
  assetSystem: AssetSystem
  buildBurnSystem: BuildBurnSystem
  prices: OracleRouter | MockPrices
  collateralSystem: CollateralSystem
  config: Config
  debtSystem: DebtSystem
  exchangeSystem: ExchangeSystem
  rewardSystem: RewardSystem
  liquidation: Liquidation
  pancakeRouter: PancakeRouterV2
  publicCatalystMath: PublicCatalystMath
  minerReward: MinerReward
  linearRelease: LinearRelease
  lp_usdc_BST: PancakePair
  platformTokenDexOracle?: PancakeOracle
  pancakeFactory: PancakeFactory
  timelock: Timelock
}
