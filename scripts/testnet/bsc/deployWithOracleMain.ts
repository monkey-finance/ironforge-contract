import { deployWithOracle } from "./deployWithOracle"
import { ethers } from "hardhat"
import { testAfterDeploy } from "../delpoyTests/test"
import { logger } from "../../utilities/log"

async function main() {
  const [deployer] = await ethers.getSigners()
  const admin = deployer
  const deployed = await deployWithOracle()
  logger.info("start check......")
  await testAfterDeploy({ deployer, ethers, deployed })
  return deployed.output
}

main()
  .then(async (output) => {
    const fs = require("fs")
    fs.writeFileSync("global.bsctestnet.json", JSON.stringify(output, null, 4))
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
