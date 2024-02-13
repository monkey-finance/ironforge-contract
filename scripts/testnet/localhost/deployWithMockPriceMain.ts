/**
 * This file is for bootstrapping a testing environment that's as complete as possible.
 * Note that this is intended for integration tests. For unit tests, you are recommended
 * to use mocks etc. to isolate the module under test.
 */

import { deployWithMockPrice } from "./deployWithMockPrice"
import { ethers } from "hardhat"
import { testAfterDeploy } from "../delpoyTests/test"
import { logger } from "../../utilities/log"

async function main() {
  const [deployer] = await ethers.getSigners()
  const admin = deployer
  const deployed = await deployWithMockPrice(deployer, admin)
  logger.info("start check......")
  await testAfterDeploy({ deployer, ethers, deployed })
  return deployed.output
}

main()
  .then(async (output) => {
    const fs = require("fs")
    fs.writeFileSync("global.dev.json", JSON.stringify(output, null, 4))
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
