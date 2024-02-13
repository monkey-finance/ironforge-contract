import { task } from "hardhat/config"
import { logger } from "../scripts/utilities/log"
import { DEPLOYER_PRIVATE_KEY, ORACLE_SERVER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import QuarterlyContractOracleAbi from "../abi/QuarterlyContractOracle.json"
import OracleRouterAbi from "../abi/OracleRouter.json"

import { IPrices, QuarterlyContractOracle } from "../typechain"
import { DateTime } from "luxon"

export const cmdUpdateQuarterlyContractPrice = task("a-UpdateQuarterlyContractPrice")
  .setAction(async function ({ symbol, price }, { ethers, run }) {
    logger.info(`cmdUpdateQuarterlyContract start: ${deployAddresses.QuarterlyContractOracle}`)

    logger.info(`symbol: ${symbol}, price: ${price}`)

    const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
    const oracleServer = new ethers.Wallet(ORACLE_SERVER_PRIVATE_KEY, ethers.provider)
    logger.info(`oracleServer address: ${oracleServer.address}`)

    const quarterlyContractOracle = new ethers.Contract(
      deployAddresses.QuarterlyContractOracle,
      QuarterlyContractOracleAbi,
      oracleServer
    ) as QuarterlyContractOracle
    try {
      const setPrice = ethers.utils.parseEther(price)
      logger.info(`set ${symbol} price : ${setPrice.toString()} - ${Math.ceil(Date.now() / 1000)}`)
      const rsp = await (
        await quarterlyContractOracle.setQuarterlyContractPrice(
          ethers.utils.formatBytes32String(symbol),
          setPrice,
          Math.ceil(Date.now() / 1000)
        )
      ).wait(1)
      logger.info(`transactionHash ${rsp.transactionHash}`)
      logger.info(`Prices address: ${deployAddresses.Prices}`)
      const prices = new ethers.Contract(deployAddresses.Prices, OracleRouterAbi, deployer) as IPrices
      const priceAfter = await prices.getPrice(ethers.utils.formatBytes32String(symbol))
      logger.info(`${symbol}: ${priceAfter.toString()}`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdUpdateQuarterlyContractPrice end`)
  })
  .addParam("symbol", "symbol of token", "lBTCUSD_211231")
  .addParam("price", "price of token", "41113")

export const cmdQuarterlyContractPriceStaled = task("a-QuarterlyContractPriceStaled")
  .setAction(async function ({ symbol }, { ethers, run }) {
    // const symbol = "lBTCUSD_210924"
    logger.info(
      `cmdExchangeQuarterlyContract start- symbol: ${symbol}, QuarterlyContractOracle: ${deployAddresses.QuarterlyContractOracle}`
    )
    const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
    try {
      const prices = new ethers.Contract(deployAddresses.Prices, OracleRouterAbi, deployer) as IPrices
      logger.info(`Prices address: ${deployAddresses.Prices}`)
      const isPriceStaled = await prices.isPriceStaled(ethers.utils.formatBytes32String(symbol))
      logger.info(` ${symbol} isPriceStaled: ${isPriceStaled}`)
      const [price, time] = await prices.getPriceAndUpdatedTime(ethers.utils.formatBytes32String(symbol))
      const datetime = DateTime.fromSeconds(time.toNumber())
      logger.info(`${symbol} price is: ${price.toString()}, time is ${datetime.toString()}`)
    } catch (e) {
      logger.error(e)
    }
    logger.info(`cmdExchangeQuarterlyContract end`)
  })
  .addParam("symbol", "symbol of token", "lBTCUSD_211231")
