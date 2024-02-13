import { ethers } from "hardhat"
import { logger } from "../utilities/log"
import { CatalystMath, SafeDecimalMath } from "../../typechain"
import { DeployTemplate } from "./deployTemplate"

export class LibDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const safeDecimalMathFactory = await ethers.getContractFactory("SafeDecimalMath")
    const safeDecimalMath = await safeDecimalMathFactory.deploy()
    logger.info("SafeDecimalMath deployed to:", safeDecimalMath.address)

    const catalystMathFactory = await ethers.getContractFactory("CatalystMath", this.deployer)
    const catalystMath = await catalystMathFactory.deploy()
    logger.info("CatalystMath deployed to:", catalystMath.address)

    this.output.safeDecimalMath = safeDecimalMath.address
    this.output.catalystMath = catalystMath.address
    this.outputContracts.safeDecimalMath = safeDecimalMath
    this.outputContracts.catalystMath = catalystMath
  }
}
