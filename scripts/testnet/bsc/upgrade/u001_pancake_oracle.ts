import { ethers, upgrades } from "hardhat"

async function main() {
  const [deployer] = await ethers.getSigners()
  const admin = deployer
  const pancakeOracleOldAddress = "0x4b75E3C8f3fA9ee0BcEB7786154EBa1ce0453Adc"
  const [PancakeOracleFactory] = await Promise.all(
    ["PancakeOracle"].map((contractName) => ethers.getContractFactory(contractName, deployer))
  )
  await upgrades.upgradeProxy(pancakeOracleOldAddress, PancakeOracleFactory, {
    unsafeAllowLinkedLibraries: true,
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
