import { ethers, upgrades } from "hardhat"
import { deployAddresses } from "../../../utilities/deployAddresses"
import { logger } from "../../../utilities/log"

async function main() {
  const [deployer] = await ethers.getSigners()
  const admin = deployer
  const oracleRouterProxy = deployAddresses.Prices
  logger.debug(
    `oracleRouterProxy: ${oracleRouterProxy}, deployAddresses.safeDecimalMath: ${deployAddresses.safeDecimalMath}`
  )
  const OracleRouterFactory = await ethers.getContractFactory("OracleRouter", {
    signer: deployer,
    libraries: {
      "contracts/libs/SafeDecimalMath.sol:SafeDecimalMath": deployAddresses.safeDecimalMath,
    },
  })

  await upgrades.upgradeProxy(oracleRouterProxy, OracleRouterFactory, {
    unsafeAllowLinkedLibraries: true,
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
