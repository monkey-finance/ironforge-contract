import { ethers, upgrades } from "hardhat"
import { PlatformTokenDexDeployer } from "../common/PlatformTokenDexDeployer"
import { logger } from "../utilities/log"

async function main() {
  logger.info("010_deploy_platform_token_dex_oracle start ...")
  const [deployer] = await ethers.getSigners()
  const dexDeployer = new PlatformTokenDexDeployer(deployer)
  await dexDeployer.deploy()
  logger.info("010_deploy_platform_token_dex_oracle end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
