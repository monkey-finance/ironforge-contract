import { ethers, upgrades } from "hardhat"
import { ChainlinkSystemDeployer } from "../common/ChainlinkSystemDeployer"
import { logger } from "../utilities/log"

async function main() {
  logger.info("008_deploy_chainlink start ...")
  const [deployer] = await ethers.getSigners()
  const chainlinkDeployer = new ChainlinkSystemDeployer(deployer)
  await chainlinkDeployer.deploy()
  logger.info("008_deploy_chainlink end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
