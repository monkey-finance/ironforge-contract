// await minerReward.addPool(1, platformToken.address, linearRelease.address, 0)

import { task } from "hardhat/config"
import { logger } from "../scripts/utilities/log"
import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import MinerRewardAbi from "../abi/MinerReward.json"
import LinearReleaseAbi from "../abi/LinearRelease.json"
import { ethers } from "ethers"
import { LinearRelease, MinerReward } from "../typechain"

export const cmdAddPool = task("a-addPool")
  .setAction(async function ({ tokenAddress, allocPoint, ifLock, startBlock }, { ethers, run }) {
    logger.info(`cmdAddPool start...`)
    try {
      const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
      logger.info(`user balance is ${await user.getBalance()}`)
      const minerReward = new ethers.Contract(deployAddresses.MinerReward, MinerRewardAbi, user) as MinerReward
      const poolLengthBefore = (await minerReward.poolLength()).toNumber()

      console.log("poolLengthBefore: ", poolLengthBefore)

      let linearRelease = "0x0000000000000000000000000000000000000000"
      if (ifLock) {
        linearRelease = deployAddresses.LinearRelease
      }
      const rsp = await (await minerReward.addPool(allocPoint, tokenAddress, linearRelease, startBlock)).wait(1)
      logger.info(`transactionHash ${rsp.transactionHash}`)
      const poolLengthAfter = (await minerReward.poolLength()).toNumber()
      const pool = await minerReward.poolInfo(poolLengthAfter - 1)
      console.log("poolLengthAfter: ", poolLengthAfter)
      console.log("poolAddedBefore: ", pool)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdAddPool end`)
  })
  .addParam("tokenAddress", "Stake token address")
  .addParam("allocPoint", "Allocate points for the pool")
  .addParam("ifLock", "If need linear release lock")
  .addParam("startBlock", "Stark block for generating reward")
