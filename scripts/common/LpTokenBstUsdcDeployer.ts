import { ethers } from "hardhat"
import { PancakeFactory, PancakePair__factory, PancakeRouterV2 } from "../../typechain"
import { logger } from "../utilities/log"
import { DeployTemplate } from "./deployTemplate"
import { settings } from "../bscmainnet/settings.mainnet"
import IERC20Abi from "../../abi/IERC20.json"
const configs = process.env.NODE_ENV === "test" ? settings.testnet : settings.mainnet
export class LpTokenBstUsdcDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const output = this.output
    const outputContracts = this.outputContracts
    const deployer = this.deployer
    const PancakeFactory = await ethers.getContractFactory("PancakeFactory", deployer)
    const pancakeFactory = PancakeFactory.attach(configs.PancakeFactoryContract)
    const PancakeRouterFactory = await ethers.getContractFactory("PancakeRouterV2", deployer)
    const pancakeRouter = PancakeRouterFactory.attach(configs.PancakeRouterContract)
    const PlatformTokenFactory = await ethers.getContractFactory("IronForgeToken", deployer)
    const platformToken = PlatformTokenFactory.attach(output.platformToken as string)
    const usdcToken = await ethers.getContractAt(IERC20Abi, configs.usdcToken)

    //TODO make sure balance is enough
    /// Setup BST-USDC pair on Pancakeswap
    const amountUSDC = ethers.utils.parseEther("10000")
    const amountBST = ethers.utils.parseEther("100000") // price = 0.1

    try {
      await (await pancakeFactory.createPair(platformToken.address, usdcToken.address)).wait(1)
    } catch (err) {
      console.log(err)
    }
    const lp = PancakePair__factory.connect(
      await pancakeFactory.getPair(platformToken.address, usdcToken.address),
      deployer
    )
    await lp.deployed()
    const deadline = 2000000000
    await usdcToken.connect(deployer).approve(pancakeRouter.address, amountUSDC)
    await platformToken.connect(deployer).approve(pancakeRouter.address, amountBST)

    await (
      await pancakeRouter.addLiquidity(
        usdcToken.address,
        platformToken.address,
        amountUSDC,
        amountBST,
        0,
        0,
        deployer.address,
        deadline
      )
    ).wait(1)

    output.pancakeFactory = pancakeFactory.address
    outputContracts.pancakeFactory = pancakeFactory

    output.pancakeRouter = pancakeRouter.address
    outputContracts.pancakeRouter = pancakeRouter

    const lpAddress = await pancakeFactory.getPair(platformToken.address, usdcToken.address)
    output["USDC-BST"] = lpAddress
    outputContracts["USDC-BST"] = lp

    logger.info(`TokensDeployer end......`)
  }
}
