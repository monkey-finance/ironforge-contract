import { ethers, upgrades } from "hardhat"
import { DeployTemplate } from "../common/deployTemplate"
import { logger } from "../utilities/log"
import { QuarterlyContractOracle } from "../../typechain"
import { settings } from "../bscmainnet/settings.mainnet"
import { formatBytes32String } from "ethers/lib/utils"
import OracleRouterAbi from "../../abi/OracleRouter.json"
export class QuarterlyContractDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer

    const oracleRouter = await ethers.getContractAt(OracleRouterAbi, output.Prices as string, deployer)
    const AccessControlFactory = await ethers.getContractFactory("AccessControl", deployer)
    const accessControl = AccessControlFactory.attach(output.AccessControl as string)

    logger.info("Setting oracle for quarterly contract start...")
    const QuarterlyContractOracleFactory = await ethers.getContractFactory("QuarterlyContractOracle", {
      signer: deployer,
    })
    let quarterlyContractOracle: QuarterlyContractOracle
    quarterlyContractOracle = (await upgrades.deployProxy(
      QuarterlyContractOracleFactory,
      [
        admin.address, // _admin
      ],
      {
        initializer: "initialize",
        unsafeAllowLinkedLibraries: true,
      }
    )) as QuarterlyContractOracle
    output.QuarterlyContractOracle = quarterlyContractOracle.address
    contractsMap.QuarterlyContractOracle = quarterlyContractOracle
    for (const [quarterlyContractName, c] of Object.entries(settings.oracle.quarterlyContracts)) {
      // Make sure the currency isn't already set to use Quarterly Contract Oracle
      const oracleSettings = await oracleRouter.oracleSettings(formatBytes32String(quarterlyContractName))
      if (oracleSettings.oracleType === settings.oracle.ORACLE_TYPE_QUARTERLY_CONTRACT) {
        logger.info(`${quarterlyContractName} already usd Quarterly Contract Oracle...`)
        continue
      }

      logger.info(`quarterlyContractName : ${quarterlyContractName}`)
      await oracleRouter.connect(admin).addQuarterlyContractOracle(
        formatBytes32String(quarterlyContractName), // currencyKey
        quarterlyContractOracle.address, // oracleAddress
        false // removeExisting
      )

      logger.info(`Setting stale period to ${c.stalePeriod} seconds...`)
      await oracleRouter.setStalePeriodOverride(
        formatBytes32String(quarterlyContractName), // currencyKey
        c.stalePeriod // newStalePeriod
      )
    }
    logger.info(`Setting ORACLE_SERVER_ROLE_ADDRESS ${settings.oracle.ORACLE_SERVER_ROLE_ADDRESS}...`)

    await accessControl.SetRoles(
      formatBytes32String(settings.oracle.ORACLE_SERVER_ROLE_KEY), // roleType
      [settings.oracle.ORACLE_SERVER_ROLE_ADDRESS], // addresses
      [true] // setTo
    )

    logger.info("quarterlyContractOracle end...")
  }
}