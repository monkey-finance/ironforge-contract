import { ethers, upgrades } from "hardhat"
import { DeployTemplate } from "../common/deployTemplate"
import { logger } from "../utilities/log"
import { settings } from "../bscmainnet/settings.mainnet"
import IERC20Abi from "../../abi/IERC20.json"
import { PancakeOracle } from "../../typechain"
import { formatBytes32String } from "ethers/lib/utils"
import OracleRouterAbi from "../../abi/OracleRouter.json"
const configs = process.env.NODE_ENV === "test" ? settings.testnet : settings.mainnet

const USDC = configs.usdcToken
const PancakeRouterV2Contract = configs.PancakeRouterContract
export class PlatformTokenDexDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    logger.info(`deploy core system start......\n${JSON.stringify(this.output, null, 4)}`)
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer
    logger.info(`deployPlatformTokenDexOracle start...`)

    const oracleRouter = await ethers.getContractAt(OracleRouterAbi, output.Prices as string, deployer)

    const PancakeRouterFactory = await ethers.getContractFactory("PancakeRouterV2", deployer)
    const pancakeRouter = PancakeRouterFactory.attach(PancakeRouterV2Contract)

    const PlatformTokenFactory = await ethers.getContractFactory("IronForgeToken", deployer)
    const platformToken = PlatformTokenFactory.attach(output.platformToken as string)

    const usdcToken = await ethers.getContractAt(IERC20Abi, USDC)

    const [PancakeOracleFactory] = await Promise.all(
      ["PancakeOracle"].map((contractName) =>
        ethers.getContractFactory(contractName, {
          signer: deployer,
        })
      )
    )

    logger.info("Deploying PancakeOracle...")
    const platformTokenPancakeOracle = (
      await upgrades.deployProxy(
        PancakeOracleFactory,
        [pancakeRouter.address, platformToken.address, usdcToken.address],
        {
          initializer: "initialize",
          unsafeAllowLinkedLibraries: true,
        }
      )
    ).connect(admin) as PancakeOracle
    logger.info("PancakeOracle proxy deployed to:", platformTokenPancakeOracle.address)

    /**
     * Setting oracle for all existing currencies...
     */
    logger.info("Setting oracle for all existing currencies...")

    for (const [liquid, c] of Object.entries(settings.oracle.dexOracles)) {
      // Make sure the currency isn't already set to use Chainlink
      const oracleSettings = await oracleRouter.oracleSettings(formatBytes32String(liquid))
      if (oracleSettings.oracleType === settings.oracle.ORACLE_TYPE_DEX) {
        logger.error(`${liquid} already usd Dex Oracle...`)
        continue
      }

      logger.info(`Set oracle of ${liquid}`)
      await oracleRouter.addDexOracle(
        formatBytes32String(liquid), // currencyKey
        platformTokenPancakeOracle.address, // oracleAddress
        true // removeExisting
      )

      logger.info(`Setting stale period to ${c.stalePeriod} seconds...`)
      await oracleRouter.setStalePeriodOverride(
        formatBytes32String(liquid), // currencyKey
        c.stalePeriod // newStalePeriod
      )
    } // end for

    logger.info("platformTokenDexOracle deployed to:", platformTokenPancakeOracle.address)
    output.platformTokenDexOracle = platformTokenPancakeOracle.address
    contractsMap.platformTokenDexOracle = platformTokenPancakeOracle
    logger.info(`platformTokenPancakeOracle end...`)
  }
}