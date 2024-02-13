import { ethers, upgrades } from "hardhat"
import { RewardSystemDeployer } from "../common/RewardSystemDeployer"
import { logger } from "../utilities/log"

async function main() {
  logger.info("012_deploy_reward_system start ...")
  const [deployer] = await ethers.getSigners()
  const rewardDeployer = new RewardSystemDeployer(deployer)
  await rewardDeployer.deploy()
  logger.info("012_deploy_reward_system end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
