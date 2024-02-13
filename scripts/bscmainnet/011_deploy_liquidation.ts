import { ethers, upgrades } from "hardhat"
import { LiquidationDeployer } from "../common/LiquidationDeployer"
import { logger } from "../utilities/log"

async function main() {
  logger.info("011_deploy_liquidation start ...")
  const [deployer] = await ethers.getSigners()
  const liquidationDeployer = new LiquidationDeployer(deployer)
  await liquidationDeployer.deploy()
  logger.info("011_deploy_liquidation end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
