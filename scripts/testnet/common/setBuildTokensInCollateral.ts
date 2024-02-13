import { settings } from "./settings"
import { CollateralSystem } from "../../../typechain"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { logger } from "../../utilities/log"
import { ethers } from "hardhat"

export async function setBuildTokensInCollateral(
  admin: SignerWithAddress,
  collateralSystem: CollateralSystem,
  output: Record<string, any>
) {
  logger.info(`setBuildTokensInCollateral start ......${JSON.stringify(output.buildTokens, null, 4)}`)

  let tokens = [],
    minCollateral = [],
    tokenAddress = [],
    closes = []

  for (const token of settings.buildTokens) {
    tokens.push(ethers.utils.formatBytes32String(token.key))
    minCollateral.push(token.minCollateral)
    closes.push(token.close)
    logger.info(`token.name ${token.name}`)
    tokenAddress.push(output.buildTokens[token.name])
  }
  logger.debug(`output.buildTokens ${JSON.stringify(output.buildTokens, null, 4)}`)
  logger.debug(`tokens ${tokens}`)
  logger.debug(`minCollateral ${minCollateral}`)
  logger.debug(`closes ${closes}`)
  logger.debug(`tokenAddress ${tokenAddress}`)
  await collateralSystem.connect(admin).updateTokenInfos(tokens, tokenAddress, minCollateral, closes)
  logger.info(`setBuildTokensInCollateral end......`)
}
