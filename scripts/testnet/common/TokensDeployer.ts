import { ethers } from "hardhat"
import { IronForgeToken, MockERC20, MockERC20__factory } from "../../../typechain"
import { logger } from "../../utilities/log"
import { PlatformTokenDeployer } from "../../common/PlatformTokenDeployer"
import { DeployTemplate } from "../../common/deployTemplate"

export class TokensDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    logger.info(`deployTokens start......\n${JSON.stringify(this.output, null, 4)}`)
    const output = this.output
    const contractsMap = this.outputContracts

    const deployer = this.deployer
    const admin = deployer
    output.buildTokens = {}

    const platformTokenDeployer = new PlatformTokenDeployer(deployer, output, contractsMap)
    const contractMap = await platformTokenDeployer.deploy()
    const platformToken = contractMap.platformToken as IronForgeToken
    logger.info("platformToken proxy deployed to:", platformToken.address)

    const tokenFactory = (await ethers.getContractFactory("MockERC20")) as unknown as MockERC20__factory
    const usdcToken = (await tokenFactory.deploy(
      "IronForge USDC", // _name
      "USDC" // _symbol
    )) as MockERC20
    logger.info("usdcToken deployed to:", usdcToken.address)

    const btcToken = (await tokenFactory.deploy(
      "IronForge BTC", // _name
      "BTC" // _symbol
    )) as MockERC20
    logger.info("btcToken deployed to:", btcToken.address)

    const ethToken = (await tokenFactory.deploy(
      "IronForge ETH", // _name
      "ETH" // _symbol
    )) as MockERC20

    logger.info("ethToken proxy deployed to:", ethToken.address)

    const usdtToken = (await tokenFactory.deploy(
      "IronForge USDT", // _name
      "USDT" // _symbol
    )) as MockERC20
    logger.info("usdtToken deployed to:", usdtToken.address)

    // mint testnet tokes

    await usdcToken.connect(admin).mint(admin.address, ethers.utils.parseEther("1000000000"))
    logger.info("usdcToken balance: ", admin.address, (await usdcToken.balanceOf(admin.address)).toString())

    await platformToken.connect(admin).mint(admin.address, ethers.utils.parseEther("1000000000"))
    logger.info("platformToken balance: ", admin.address, (await platformToken.balanceOf(admin.address)).toString())

    await btcToken.connect(admin).mint(admin.address, ethers.utils.parseEther("1000000000"))
    logger.info("btc balance: ", admin.address, (await btcToken.balanceOf(admin.address)).toString())

    await ethToken.connect(admin).mint(admin.address, ethers.utils.parseEther("1000000000"))
    logger.info("eth balance: ", admin.address, (await ethToken.balanceOf(admin.address)).toString())

    await usdtToken.connect(admin).mint(admin.address, ethers.utils.parseEther("1000000000"))
    logger.info("usdtToken balance: ", admin.address, (await usdtToken.balanceOf(admin.address)).toString())

    output.platformToken = platformToken.address
    contractsMap.platformToken = platformToken
    output.buildTokens.platformToken = platformToken.address

    output.buildTokens.usdcToken = usdcToken.address
    contractsMap.usdcToken = usdcToken

    output.buildTokens.btcToken = btcToken.address
    contractsMap.btcToken = btcToken

    output.buildTokens.ethToken = ethToken.address
    contractsMap.ethToken = ethToken

    output.buildTokens.usdtToken = usdtToken.address
    contractsMap.usdtToken = usdtToken

    logger.info(`deployTokens end......`)
  }
}
