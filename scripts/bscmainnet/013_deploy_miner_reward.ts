import { ethers, upgrades } from "hardhat"
import { MinerRewardDeployer } from "../common/MinerRewardDeployer"
import { logger } from "../utilities/log"

async function main() {
  logger.info("013_deploy_miner_reward start ...")
  const [deployer] = await ethers.getSigners()
  const minerRewardDeployer = new MinerRewardDeployer(deployer)
  await minerRewardDeployer.deploy()
  logger.info("013_deploy_miner_reward end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
