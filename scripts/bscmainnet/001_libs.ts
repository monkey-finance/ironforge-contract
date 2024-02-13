import { ethers } from "hardhat"
import { LibDeployer } from "../common/LibDeployer"

async function main() {
  const [deployer] = await ethers.getSigners()
  const deployLib = new LibDeployer(deployer)
  await deployLib.deploy()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
