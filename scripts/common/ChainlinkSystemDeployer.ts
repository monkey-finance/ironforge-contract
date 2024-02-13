import { ethers, upgrades } from "hardhat"
import { DeployTemplate } from "../common/deployTemplate"
import { logger } from "../utilities/log"
import { Duration } from "luxon"
import { OracleRouter } from "../../typechain"
import { settings } from "../bscmainnet/settings.mainnet"
import { formatBytes32String } from "ethers/lib/utils"
import EACAggregatorProxyAbi from "../abis/EACAggregatorProxy.json"
const ORACLE_TYPE_CHAINLINK: number = settings.oracle.ORACLE_TYPE_CHAINLINK

export class ChainlinkSystemDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    logger.info(`deploy core system start......\n${JSON.stringify(this.output, null, 4)}`)
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer

    const OracleRouterFactory = await ethers.getContractFactory("OracleRouter", {
      signer: deployer,
      libraries: {
        "contracts/libs/SafeDecimalMath.sol:SafeDecimalMath": output.safeDecimalMath as string,
      },
    })

    logger.info("Deploying OracleRouter...")

    const oracleRouter = (
      await upgrades.deployProxy(
        OracleRouterFactory,
        [
          admin.address, // _admin
        ],
        {
          initializer: "initialize",
          unsafeAllowLinkedLibraries: true,
        }
      )
    ).connect(admin) as OracleRouter
    output.Prices = oracleRouter.address
    contractsMap.Prices = oracleRouter
    logger.info("Updating address cache...")

    await oracleRouter.setGlobalStalePeriod(
      Duration.fromObject({ minutes: 2 }).as("seconds") // newStalePeriod
    )

    /**
     * Setting oracle for all existing currencies...
     */
    logger.info("Setting oracle for all existing currencies...")

    for (const [liquid, c] of Object.entries(settings.oracle.chainLinkOracles)) {
      // Double check to make sure we're not using the wrong aggregator
      const aggregator = ethers.ContractFactory.getContract(c.aggregatorAddress, EACAggregatorProxyAbi)
      if (settings.checkChainLinkDesc) {
        const aggregatorDescription: string = await aggregator.connect(ethers.provider).description()
        if (aggregatorDescription != `${liquid.substr(1)} / USD`) {
          logger.info(`${liquid} : aggregator description mismatch...`)
          continue
        }
      }
      // Make sure the currency isn't already set to use Chainlink
      const oracleSettings = await oracleRouter.oracleSettings(formatBytes32String(liquid))
      if (oracleSettings.oracleType === ORACLE_TYPE_CHAINLINK) {
        logger.info(`${liquid} already usd Chainlink...`)
        continue
      }

      logger.info("Set oracle to Chainlink...")
      await oracleRouter.addChainlinkOracle(
        formatBytes32String(liquid), // currencyKey
        c.aggregatorAddress, // oracleAddress
        true // removeExisting
      )

      logger.info(`Setting stale period to ${c.stalePeriod} seconds...`)
      await oracleRouter.setStalePeriodOverride(
        formatBytes32String(liquid), // currencyKey
        c.stalePeriod // newStalePeriod
      )
    } // end for
    logger.info("deployChainLink end...")
  }
}