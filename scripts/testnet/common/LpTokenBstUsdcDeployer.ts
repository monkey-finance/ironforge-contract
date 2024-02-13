import { ethers } from "hardhat"
import { PancakeFactory, PancakePair__factory, PancakeRouterV2 } from "../../../typechain"
import { logger } from "../../utilities/log"
import { DeployTemplate } from "../../common/deployTemplate"

export class LpTokenBstUsdcDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const deployer = this.deployer
    const PancakeFactoryFactory = await ethers.getContractFactory("PancakeFactory", deployer)
    const pancakeFactory = (await PancakeFactoryFactory.deploy(await deployer.getAddress())) as PancakeFactory
    await pancakeFactory.deployed()
    const MockWBNB = await ethers.getContractFactory("MockWBNB", deployer)
    const mockWBNB = await MockWBNB.deploy()
    const PancakeRouter = await ethers.getContractFactory("PancakeRouterV2", deployer)
    const pancakeRouter = (await PancakeRouter.deploy(pancakeFactory.address, mockWBNB.address)) as PancakeRouterV2

    /// Setup BST-USDC pair on Pancakeswap
    const amountUSDC = ethers.utils.parseEther("10000")
    const amountBST = ethers.utils.parseEther("100000") // price = 0.1

    const platformToken = this.outputContracts.platformToken
    const usdcToken = this.outputContracts.usdcToken

    await (await pancakeFactory.createPair(platformToken.address, usdcToken.address)).wait(1)
    const lp = PancakePair__factory.connect(
      await pancakeFactory.getPair(platformToken.address, usdcToken.address),
      deployer
    )
    await lp.deployed()
    const deadline = 2000000000
    await usdcToken.approve(pancakeRouter.address, amountUSDC)
    await platformToken.approve(pancakeRouter.address, amountBST)

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

    // 官方也添加一些流动性
    const output = this.output
    const outputContracts = this.outputContracts

    output.pancakeFactory = pancakeFactory.address
    outputContracts.pancakeFactory = pancakeFactory

    output.pancakeRouter = pancakeRouter.address
    outputContracts.pancakeRouter = pancakeRouter

    output["USDC-BST"] = lp.address
    outputContracts["USDC-BST"] = lp

    logger.info(`TokensDeployer end......`)
  }
}
