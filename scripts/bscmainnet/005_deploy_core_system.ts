import { ethers, upgrades } from "hardhat"
import { CoreSystemDeployer } from "../common/CoreSystemDeployer"
import { logger } from "../utilities/log"


async function main() {
  logger.info("005_deploy_core_system start ...")
  const [deployer] = await ethers.getSigners()
  const coreSystemDeployer = new CoreSystemDeployer(deployer)
  await coreSystemDeployer.deploy()
  logger.info("005_deploy_core_system end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
