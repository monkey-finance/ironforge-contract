import { ethers } from "hardhat"
import { logger } from "../utilities/log"
import { CatalystMath, MockPrices, SafeDecimalMath } from "../../typechain"
import { DeployTemplate } from "./deployTemplate"
import { Duration } from "luxon"

export class MockPricesDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer
    const [MockPricesFactory] = await Promise.all(
      ["MockPrices"].map((contractName) =>
        ethers.getContractFactory(contractName, {
          signer: deployer,
          libraries: {
            "contracts/libs/SafeDecimalMath.sol:SafeDecimalMath": output.safeDecimalMath as string,
          },
        })
      )
    )
    const prices = (await MockPricesFactory.deploy(
      Duration.fromObject({ hours: 12 }).as("seconds") // _stalePeriod
    )) as MockPrices
    logger.info("Prices deployed to:", prices.address)
    output.Prices = prices.address
    contractsMap.Prices = prices
  }
}
