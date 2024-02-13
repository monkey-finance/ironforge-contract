import { task } from "hardhat/config"
import { logger } from "../scripts/utilities/log"
import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import OracleRouterAbi from "../abi/OracleRouter.json"
import { OracleRouter } from "../typechain"
import { boolean } from "hardhat/internal/core/params/argumentTypes"

export const cmdStale = task("a-setStale")
  .setAction(async function ({ symbol, period }, { ethers, run }) {
    logger.info(`setStale start...`)
    logger.info(`symbol: ${symbol}, period: ${period}`)
    const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
    logger.info(`user balance is ${await user.getBalance()}`)
    logger.debug(`Prices(OracleRouter) : ${deployAddresses.Prices}`)

    try {
      const oracleRouterContract = new ethers.Contract(deployAddresses.Prices, OracleRouterAbi, user) as OracleRouter
      const beforePeriod = await oracleRouterContract.getStalePeriodForCurrency(
        ethers.utils.formatBytes32String(symbol)
      )

      const rsp1 = await (
        await oracleRouterContract.setStalePeriodOverride(
          ethers.utils.formatBytes32String(symbol), // currencyKey
          period // newStalePeriod
        )
      ).wait(1)
      logger.info(`transactionHash ${rsp1.transactionHash}`)
      const afterPeriod = await oracleRouterContract.getStalePeriodForCurrency(ethers.utils.formatBytes32String(symbol))
      console.log(`beforePeriod: ${beforePeriod}, afterPeriod: ${afterPeriod}`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`setStale end`)
  })
  .addParam("symbol", "symbol", "lBTCUSD_210924")
  .addParam("period", "period", "1")

export const cmdFrozen = task("a-setFrozen")
  .setAction(async function ({ symbol, frozen }, { ethers, run }) {
    logger.info(`setStale start...`)
    logger.info(`symbol: ${symbol}, frozen: ${frozen}`)
    const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
    logger.info(`user balance is ${await user.getBalance()}`)
    logger.debug(`Prices(OracleRouter) : ${deployAddresses.Prices}`)

    try {
      const oracleRouterContract = new ethers.Contract(deployAddresses.Prices, OracleRouterAbi, user) as OracleRouter
      const beforeFrozen = await oracleRouterContract.isFrozen(ethers.utils.formatBytes32String(symbol))
      const beforeStaled = await oracleRouterContract.isPriceStaled(ethers.utils.formatBytes32String(symbol))

      const rsp1 = await (
        await oracleRouterContract.setFrozen(
          ethers.utils.formatBytes32String(symbol), // currencyKey
          frozen // newStalePeriod
        )
      ).wait(1)
      logger.info(`transactionHash ${rsp1.transactionHash}`)
      const afterFrozen = await oracleRouterContract.isFrozen(ethers.utils.formatBytes32String(symbol))
      const afterStaled = await oracleRouterContract.isPriceStaled(ethers.utils.formatBytes32String(symbol))
      console.log(`beforeFrozen: ${beforeFrozen}, afterFrozen: ${afterFrozen}`)
      console.log(`beforeStaled: ${beforeStaled}, afterStaled: ${afterStaled}`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`setStale end`)
  })
  .addParam("symbol", "symbol", "lBTCUSD_210924")
  .addParam("frozen", "frozen", true, boolean)
