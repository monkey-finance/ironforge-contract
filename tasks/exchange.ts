import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import ExchangeSystemAbi from "../abi/ExchangeSystem.json"
import ERC20Abi from "../abi/ERC20.json"
import { ExchangeSystem } from "../typechain"
import { logger } from "../scripts/utilities/log"
import { task } from "hardhat/config"

export const cmdExchange = task("a-exchange")
  .setAction(async function ({ from, fromAddress, amount, to, toAddress }, { ethers, run }) {
    logger.info(`cmdExchange start...`)
    const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
    logger.info(`user balance is ${await user.getBalance()}`)
    logger.debug(`deployAddresses.ExchangeSystem : ${deployAddresses.ExchangeSystem}`)

    try {
      const exchangeSystemContract = new ethers.Contract(
        deployAddresses.ExchangeSystem,
        ExchangeSystemAbi,
        user
      ) as ExchangeSystem

      logger.info(`${from} token address is ${fromAddress}`)
      const fromContract = new ethers.Contract(fromAddress, ERC20Abi, user)
      logger.info(`user ${from} balance is ${await fromContract.balanceOf(user.address)}`)
      await (await fromContract.approve(exchangeSystemContract.address, ethers.constants.MaxUint256)).wait()

      logger.info(`${to} token address is ${toAddress}`)
      const toContract = new ethers.Contract(toAddress, ERC20Abi, user)
      logger.info(`user ${to} balance is ${await toContract.balanceOf(user.address)}`)
      await (await toContract.approve(exchangeSystemContract.address, ethers.constants.MaxUint256)).wait()

      logger.info(`amount is ${amount}`)

      const rsp1 = await (
        await exchangeSystemContract.exchange(
          ethers.utils.formatBytes32String(from),
          ethers.utils.parseEther(amount),
          user.address,
          ethers.utils.formatBytes32String(to)
        )
      ).wait(1)
      logger.info(`transactionHash ${rsp1.transactionHash}`)
      const lastPendingExchangeEntryId = await exchangeSystemContract.lastPendingExchangeEntryId()
      console.log(
        `exchangeSystem.lastPendingExchangeEntryId: ${deployAddresses.ExchangeSystem}, lastPendingExchangeEntryId: ${lastPendingExchangeEntryId}`
      )
      logger.info(`exchange end...`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdExchange end`)
  })
  .addParam("from", "from symbol", "FUSD")
  .addParam("fromAddress", "from address", deployAddresses.synths.FUSD)
  .addParam("amount", "from symbol amount", "1")
  .addParam("to", "to symbol", "lBTCUSD_210924")
  .addParam("toAddress", "to address", deployAddresses.synths.lBTCUSD_210924)

export const cmdIsSettle = task("a-isSettle")
  .setAction(async function ({ id }, { ethers, run }) {
    logger.info(`a-isSettle start...`)
    logger.debug(`a-isSettle id is ${id}`)
    const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
    logger.info(`user balance is ${await user.getBalance()}`)

    try {
      const exchangeSystemContract = new ethers.Contract(
        deployAddresses.ExchangeSystem,
        ExchangeSystemAbi,
        user
      ) as ExchangeSystem
      const rsp1 = await exchangeSystemContract.pendingExchangeEntries(id)
      logger.info(`transactionHash ${JSON.stringify(rsp1, null, 4)}`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`a-isSettle end`)
  })
  .addParam("id", "pending id", "1")

export const cmdSettle = task("a-settle")
  .setAction(async function ({ id }, { ethers, run }) {
    logger.info(`cmdSettle start...`)
    logger.debug(`id is : ${id}`)
    logger.debug(`deployAddresses.ExchangeSystem : ${deployAddresses.ExchangeSystem}`)

    const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
    logger.info(`user balance is ${await user.getBalance()}`)

    try {
      const exchangeSystemContract = new ethers.Contract(
        deployAddresses.ExchangeSystem,
        ExchangeSystemAbi,
        user
      ) as ExchangeSystem
      const rsp1 = await (await exchangeSystemContract.settle(id)).wait(1)
      logger.info(`transactionHash ${rsp1.transactionHash}`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdSettle end`)
  })
  .addParam("id", "pending id", "1")

export const cmdRollback = task("a-rollback")
  .setAction(async function ({ id }, { ethers, run }) {
    logger.info(`cmdRollback start...`)
    logger.debug(`id is ${id}`)
    const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
    logger.info(`user balance is ${await user.getBalance()}`)

    try {
      const exchangeSystemContract = new ethers.Contract(
        deployAddresses.ExchangeSystem,
        ExchangeSystemAbi,
        user
      ) as ExchangeSystem
      const rsp1 = await (await exchangeSystemContract.rollback(id)).wait(1)
      logger.info(`transactionHash ${rsp1.transactionHash}`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdRollback end`)
  })
  .addParam("id", "pending id", "1")
