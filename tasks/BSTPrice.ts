import { ethers } from "hardhat"
import ERC20 from "../abi/ERC20.json"
import PancakeRouterAbi from "../abi/PancakeRouterV2.json"
import PancakeFactoryAbi from "../abi/PancakeFactory.json"
import PancakePairAbi from "../abi/PancakePair.json"
import { task } from "hardhat/config"
import { logger } from "../scripts/utilities/log"
import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import { IERC20, PancakePair, PancakeRouterV2 } from "../typechain"

export const cmdBSTPrice = task("a-BST").setAction(async function ({}, { ethers, run }) {
  logger.info(`cmdBSTPrice start...`)
  const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)

  const deadline = 2000000000
  const BSTTokenContract = new ethers.Contract(deployAddresses.platformToken, ERC20, deployer) as IERC20
  const usdcTokenContract = new ethers.Contract(deployAddresses.buildTokens.usdcToken, ERC20, deployer) as IERC20
  const amount = ethers.utils.parseEther("10000")
  logger.info(`approve start, amount: ${amount.toString()}...`)
  await BSTTokenContract.approve(deployAddresses.pancakeRouter, amount)
  await usdcTokenContract.approve(deployAddresses.pancakeRouter, amount)
  const router = new ethers.Contract(deployAddresses.pancakeRouter, PancakeRouterAbi, deployer) as PancakeRouterV2
  logger.info(`addLiquidity start...`)
  const res = await router.addLiquidity(
    BSTTokenContract.address,
    usdcTokenContract.address,
    ethers.utils.parseEther("1000"),
    ethers.utils.parseEther("1000"),
    0,
    0,
    deployer.address,
    deadline
  )
  await res.wait()
  const factory = await ethers.getContractAt(PancakeFactoryAbi, deployAddresses.pancakeFactory)
  const pair = await factory.getPair(BSTTokenContract.address, usdcTokenContract.address)
  logger.info("lp pair: ", pair)
  const lp = (await ethers.getContractAt(PancakePairAbi, pair)) as PancakePair
  const balance = await lp.balanceOf(deployer.address)
  logger.info("lp balance: ", ethers.utils.formatEther(balance.toString()))
  logger.info(`cmdBSTPrice end`)
})
