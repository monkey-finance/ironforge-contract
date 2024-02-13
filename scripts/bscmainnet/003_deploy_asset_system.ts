import { ethers } from "hardhat"
import { logger } from "../utilities/log"
import { AssetSystemDeployer } from "../common/AssetSystemDeployer"

async function main() {
  logger.info("003_deploy_asset_system start ...")
  const [deployer] = await ethers.getSigners()
  const assetSystemDeployer = new AssetSystemDeployer(deployer)
  await assetSystemDeployer.deploy()
  logger.info("003_deploy_asset_system end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
