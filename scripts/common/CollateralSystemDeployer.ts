import { ethers, upgrades } from "hardhat"
import { DeployTemplate } from "../common/deployTemplate"
import { logger } from "../utilities/log"
import { CollateralSystem } from "../../typechain"
import { settings } from "../bscmainnet/settings.mainnet"
import { settings as settingsLocal } from "../testnet/localhost/settings.localhost"

export class CollateralSystemDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer

    const [CollateralSystemFactory] = await Promise.all(
      ["CollateralSystem", "BuildBurnSystem", "DebtSystem", "ExchangeSystem", "Liquidation"].map((contractName) =>
        ethers.getContractFactory(contractName, {
          signer: deployer,
          libraries: {
            "contracts/libs/SafeDecimalMath.sol:SafeDecimalMath": output.safeDecimalMath as string,
          },
        })
      )
    )
    const fusdToken = (output.synths as Record<string, string>).FUSD
    const collateralSystem = (await upgrades.deployProxy(
      CollateralSystemFactory,
      [
        admin.address, // admin
        fusdToken,
      ],
      {
        initializer: "initialize",
        unsafeAllowLinkedLibraries: true,
      }
    )) as CollateralSystem
    logger.info("CollateralSystem proxy deployed to:", collateralSystem.address)
    output.CollateralSystem = collateralSystem.address
    contractsMap.CollateralSystem = collateralSystem
    let tokens = [],
      minCollateral = [],
      tokenAddress = [],
      closes = []

    const buildTokens = process.env.NODE_ENV === "hardhat" ? settingsLocal.buildTokens : settings.buildTokens
    for (const token of buildTokens) {
      tokens.push(ethers.utils.formatBytes32String(token.key))
      minCollateral.push(token.minCollateral)
      closes.push(token.close)
      logger.info(`token.name ${token.name}`)
      tokenAddress.push((output.buildTokens as Record<string, string>)[token.name])
    }
    logger.debug(`output.buildTokens ${JSON.stringify(output.buildTokens, null, 4)}`)
    logger.debug(`tokens ${tokens}`)
    logger.debug(`minCollateral ${minCollateral}`)
    logger.debug(`closes ${closes}`)
    logger.debug(`tokenAddress ${tokenAddress}`)
    await collateralSystem.connect(admin).updateTokenInfos(tokens, tokenAddress, minCollateral, closes)
    logger.info(`setBuildTokensInCollateral end......`)
  }
}
