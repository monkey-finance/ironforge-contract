import { task } from "hardhat/config"
import { logger } from "../scripts/utilities/log"
import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import PancakeOracleAbi from "../abi/PancakeOracle.json"
import { PancakeOracle } from "../typechain"

export const cmdDexOracleUpdate = task("a-dexOracleUpdate").setAction(async function ({}, { ethers, run }) {
  logger.info(`cmdDexOracleUpdate start: ${deployAddresses.platformTokenDexOracle}`)
  const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)

  const pancakeOracle = new ethers.Contract(
    deployAddresses.platformTokenDexOracle,
    PancakeOracleAbi,
    user
  ) as PancakeOracle
  try {
    const periodElapsed = await pancakeOracle.periodElapsed()
    logger.info(`periodElapsed ${periodElapsed}`)
    if (periodElapsed) {
      const rsp = await (await pancakeOracle.update()).wait(1)
      logger.info(`transactionHash ${rsp.transactionHash}`)
    }
  } catch (e) {
    logger.error(e)
  }

  logger.info(`cmdDexOracleUpdate end`)
})
