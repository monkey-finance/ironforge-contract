import { ethers, upgrades } from "hardhat"
import { QuarterlyContractDeployer } from "../common/QuarterlyContractDeployer"
import { logger } from "../utilities/log"

async function main() {
  logger.info("009_deploy_quarterly_contract start ...")
  const [deployer] = await ethers.getSigners()
  const quaterlyDeployer = new QuarterlyContractDeployer(deployer)
  await quaterlyDeployer.deploy()
  logger.info("009_deploy_quarterly_contract end ...")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
