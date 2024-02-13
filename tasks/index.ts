import { cmdBuild, cmdBuildFusd } from "./build"
import { cmdAfterDeployCheck } from "./check"
import { cmdDexOracleUpdate } from "./updatePancakeOracle"
import { cmdExchange, cmdIsSettle, cmdRollback, cmdSettle } from "./exchange"
import { cmdAddPool } from "./pool"
import { cmdQuarterlyContractPriceStaled, cmdUpdateQuarterlyContractPrice } from "./quarterlyContract"
import { cmdFrozen, cmdStale } from "./oracleRouter"
import { cmdBSTPrice } from "./BSTPrice"
import { cmdAddLiquidity } from "./liquidity"
import { cmdQueryCollateralToken, cmdAddMintToken, cmdUpdateCollateralToken, cmdForbidToken } from "./collateral"
import { cmdTimelockExecuteTx, cmdTimelockQueueTx, cmdTimelockTransferOwnership } from "./timelock"
cmdBuild.setDescription("build lbtc")
cmdBuildFusd.setDescription("build fusd")
cmdDexOracleUpdate.setDescription("cmdDexOracleUpdate")
cmdAfterDeployCheck.setDescription("cmdAfterDeployCheck")
cmdExchange.setDescription("cmdExchange")
cmdAddPool.setDescription("cmdAddPool")
cmdSettle.setDescription("cmdSettle")
cmdIsSettle.setDescription("cmdIsSettle")
cmdRollback.setDescription("cmdRollback")
cmdUpdateQuarterlyContractPrice.setDescription("cmdUpdateQuarterlyContractPrice")
cmdQuarterlyContractPriceStaled.setDescription("cmdExchangeQuarterlyContract")
cmdStale.setDescription("cmdStale")
cmdFrozen.setDescription("cmdFrozen")
cmdBSTPrice.setDescription("cmdBSTPrice")
cmdAddLiquidity.setDescription("cmdAddLiquidity")
cmdQueryCollateralToken.setDescription("cmdQueryCollateralToken")
cmdAddMintToken.setDescription("cmdAddMintToken")
cmdUpdateCollateralToken.setDescription("cmdUpdateCollateralToken")
cmdForbidToken.setDescription("cmdForbidToken")
cmdTimelockExecuteTx.setDescription("cmdTimelockExecuteTx")
cmdTimelockQueueTx.setDescription("cmdTimelockQueueTx")
cmdTimelockTransferOwnership.setDescription("cmdTimelockTransferOwnership")
