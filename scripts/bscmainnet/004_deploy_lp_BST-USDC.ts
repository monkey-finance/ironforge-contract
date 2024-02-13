import { ethers } from "hardhat"
import { logger } from "../utilities/log"
import { LpTokenBstUsdcDeployer } from "../common/LpTokenBSTUsdcDeployer"

async function main() {
  logger.info("004_deploy_lp_BST-USDC start ...")
  const [deployer] = await ethers.getSigners()
  const lpBSTUsdcDeployer = new LpTokenBstUsdcDeployer(deployer)
  await lpBSTUsdcDeployer.deploy()
  logger.info("004_deploy_lp_BST-USDC end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
