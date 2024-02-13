import { ethers, upgrades } from "hardhat"
import { logger } from "../utilities/log"
import { IronForgeToken } from "../../typechain"
import { DeployTemplate } from "./deployTemplate"

export class PlatformTokenDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    /**
     * BST token contract
     */
    const ironForgeTokenFactory = await ethers.getContractFactory("IronForgeToken", this.deployer)

    const platformToken = (await upgrades.deployProxy(ironForgeTokenFactory, [], {
      initializer: "initialize",
    })) as IronForgeToken

    logger.info("platformToken proxy deployed to:", platformToken.address)

    this.output.platformToken = platformToken.address
    this.outputContracts.platformToken = platformToken
  }
}
