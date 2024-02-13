import { ethers, upgrades } from "hardhat"
import { logger } from "../utilities/log"
import { AssetSystem } from "../../typechain"
import { DeployTemplate } from "./deployTemplate"

export class AssetSystemDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    /**
     * BST token contract
     */
    const assetSystemFactory = await ethers.getContractFactory("AssetSystem", this.deployer)

    /**
     * This contract serves two purposes:
     * - An asset registry for recording all synthetic assets
     * - A contract address registry for service discovery
     */
    const assetSystem = (await upgrades.deployProxy(
      assetSystemFactory,
      [
        this.deployer.address, // _admin
      ],
      {
        initializer: "initialize",
      }
    )) as AssetSystem
    logger.info("AssetSystem proxy deployed to:", assetSystem.address)
    this.output.AssetSystem = assetSystem.address
    this.outputContracts.AssetSystem = assetSystem
  }
}
