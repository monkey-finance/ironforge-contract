import { ethers } from "hardhat"
import { FinishingWorkDeployer } from "../common/FinishingWorkDeployer"
import { logger } from "../utilities/log"
async function main() {
  logger.info("014_deploy_finishing_work start ...")
  const [deployer] = await ethers.getSigners()
  const finishingDeployer = new FinishingWorkDeployer(deployer)
  await finishingDeployer.deploy()
  logger.info("014_deploy_finishing_work-USDC end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
