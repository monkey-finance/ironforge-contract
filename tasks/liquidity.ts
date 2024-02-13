// await minerReward.addPool(1, platformToken.address, linearRelease.address, 0)

import { task } from "hardhat/config"
import { logger } from "../scripts/utilities/log"
import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import PancakeRouterAbi from "../abi/PancakeRouterV2.json"
import PancakeFactoryAbi from "../abi/PancakeFactory.json"
import ERC20 from "../abi/ERC20.json"

export const cmdAddLiquidity = task("a-addLiquidity")
  .setAction(async function ({ token1, token2, amount1, amount2, lpName }, { ethers, run }) {
    logger.info(`cmdAddLiquidity start...`)

    try {
      const deadline = 2000000000
      const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
      logger.info(`user balance is ${await user.getBalance()}`)
      const router = new ethers.Contract(deployAddresses.pancakeRouter, PancakeRouterAbi, user)
      const token1Contract = new ethers.Contract(token1, ERC20, user)
      const token2Contract = new ethers.Contract(token2, ERC20, user)

      await token1Contract.approve(deployAddresses.pancakeRouter, ethers.utils.parseEther(amount1))
      await token2Contract.approve(deployAddresses.pancakeRouter, ethers.utils.parseEther(amount2))
      const res = await (
        await router.addLiquidity(
          token1,
          token2,
          ethers.utils.parseEther(amount1),
          ethers.utils.parseEther(amount2),
          0,
          0,
          user.address,
          deadline
        )
      ).wait(1)
      //   console.log("addLiquidity: ", res)
      logger.info(`transactionHash ${res.transactionHash}`)
      const factory = new ethers.Contract(deployAddresses.pancakeFactory, PancakeFactoryAbi, user)
      const pair = await factory.getPair(token1, token2)
      console.log("lp pair: ", pair)
      const fs = require("fs")
      //@ts-ignore
      deployAddresses[lpName] = pair
      const env = process.env.NODE_ENV
      let fileName
      if (env === "test") {
        fileName = "global.bsctestnet.json"
      } else if (env === "prod") {
        fileName = "global.bscmainnet.json"
      }
      fs.writeFileSync(fileName, JSON.stringify(deployAddresses, null, 4))
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdAddLiquidity end`)
  })
  .addParam("token1", "token1 address")
  .addParam("token2", "token2 address")
  .addParam("amount1", "amount of token1")
  .addParam("amount2", "amount of token2")
  .addParam("lpName", "name of the lp")
