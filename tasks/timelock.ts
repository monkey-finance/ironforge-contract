// await minerReward.addPool(1, platformToken.address, linearRelease.address, 0)

import { task } from "hardhat/config"
import { logger } from "../scripts/utilities/log"
import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import TimelockAbi from "../abi/Timelock.json"

export const cmdTimelockTransferOwnership = task("a-timelockTransferOwnership")
  .setAction(async function ({ address, path }, { ethers, run }) {
    logger.info(`cmdTimelockTransferOwnership start...`)
    try {
      const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
      logger.info(`user balance is ${await user.getBalance()}`)
      const abi = require(path)
      const contract = new ethers.Contract(deployAddresses[address], abi, user)
      const timelock = deployAddresses["Timelock"]
      const res = await (await contract.transferOwnership(timelock)).wait(1)
      logger.info(`transactionHash ${res.transactionHash}`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdTimelockTransferOwnership end`)
  })
  .addParam("address", "contract to transfer ownership to timelock")
  .addParam("path", "path of the contract abi")

export const cmdTimelockQueueTx = task("a-timelockQueueTx")
  .setAction(async function ({ path }, { ethers, run }) {
    logger.info(`cmdTimelockQueueTx start...`)
    try {
      const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
      logger.info(`user balance is ${await user.getBalance()}`)
      const timelock = new ethers.Contract(deployAddresses.Timelock, TimelockAbi, user)
      const data = require(path)
      const { target, value, signature, paramTypes, params, eta } = data
      console.log("timelock params: ", data)
      const res = await (
        await timelock.queueTransaction(
          target,
          value,
          signature,
          ethers.utils.defaultAbiCoder.encode(paramTypes, params),
          eta
        )
      ).wait(1)
      logger.info(`transactionHash ${res.transactionHash}`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdTimelockQueueTx end`)
  })
  .addParam("path", "file path of the tx json file to execute")

export const cmdTimelockExecuteTx = task("a-timelockExecuteTx")
  .setAction(async function ({ path }, { ethers, run }) {
    logger.info(`cmdTimelockExecuteTx start...`)
    try {
      const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
      logger.info(`user balance is ${await user.getBalance()}`)
      const timelock = new ethers.Contract(deployAddresses.Timelock, TimelockAbi, user)
      const data = require(path)
      const { target, value, signature, paramTypes, params, eta } = data
      console.log("timelock params: ", data)
      const res = await (
        await timelock.executeTransaction(
          target,
          value,
          signature,
          ethers.utils.defaultAbiCoder.encode(paramTypes, params),
          eta
        )
      ).wait(1)
      logger.info(`transactionHash ${res.transactionHash}`)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdTimelockExecuteTx end`)
  })
  .addParam("path", "file path of the tx json file to execute")
