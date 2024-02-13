import { ethers } from "hardhat"
import { TokensDeployer } from "../common/TokensDeployer"
import { logger } from "../utilities/log"

async function main() {
  logger.info("002_deploy_platform_token start ...")
  const [deployer] = await ethers.getSigners()
  const tokensDeployer = new TokensDeployer(deployer)
  await tokensDeployer.deploy()
  logger.info("002_deploy_platform_token end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
