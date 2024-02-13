import { ethers, upgrades } from "hardhat"
import { CollateralSystemDeployer } from "../common/CollateralSystemDeployer"
import { logger } from "../utilities/log"

async function main() {
  logger.info("007_deploy_collateral_system start ...")
  const [deployer] = await ethers.getSigners()
  const collateralDeployer = new CollateralSystemDeployer(deployer)
  await collateralDeployer.deploy()
  logger.info("007_deploy_collateral_system-USDC end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
