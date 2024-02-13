import { ethers } from "hardhat"
import { IronForgeToken } from "../../typechain"
import { logger } from "../utilities/log"
import { PlatformTokenDeployer } from "./PlatformTokenDeployer"
import { DeployTemplate } from "./deployTemplate"
import IERC20Abi from "../../abi/IERC20.json"
import { settings } from "../bscmainnet/settings.mainnet"
const configs = process.env.NODE_ENV === "test" ? settings.testnet : settings.mainnet
console.log(">>>>>>>configs:", configs)
const USDC = configs.usdcToken //"0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
const BTC = configs.btcToken //"0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c"
const ETH = configs.ethToken // "0x2170ed0880ac9a755fd29b2688956bd959f933f8"
const USDT = configs.usdtToken // "0x55d398326f99059ff775485246999027b3197955"
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
    //TODO distribute tokens 
    await platformToken.connect(admin).mint(admin.address, ethers.utils.parseEther("1000000000"))
    logger.info("platformToken balance: ", admin.address, (await platformToken.balanceOf(admin.address)).toString())

    const usdcToken = await ethers.getContractAt(IERC20Abi, USDC)
    logger.info("usdcToken deployed to:", usdcToken.address)

    const btcToken = await ethers.getContractAt(IERC20Abi, BTC)
    logger.info("btcToken deployed to:", btcToken.address)

    const ethToken = await ethers.getContractAt(IERC20Abi, ETH)
    logger.info("ethToken proxy deployed to:", ethToken.address)

    const usdtToken = await ethers.getContractAt(IERC20Abi, USDT)
    logger.info("usdtToken deployed to:", usdtToken.address)

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
