import { ethers, upgrades } from "hardhat"
import { SyntheticsAssetsDeployer } from "../common/SyntheticsAssetsDeployer"
import { logger } from "../utilities/log"

async function main() {
  logger.info("006_deploy_synthetics_assets start ...")
  const [deployer] = await ethers.getSigners()
  const syntheticsDeployer = new SyntheticsAssetsDeployer(deployer)
  await syntheticsDeployer.deploy()
  logger.info("006_deploy_synthetics_assets-USDC end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
