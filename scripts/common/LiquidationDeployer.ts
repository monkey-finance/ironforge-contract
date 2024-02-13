import { ethers, upgrades } from "hardhat"
import { DeployTemplate } from "../common/deployTemplate"
import { logger } from "../utilities/log"
import { Liquidation } from "../../typechain"
export class LiquidationDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer

    const [LiquidationFactory] = await Promise.all(
      ["Liquidation"].map((contractName) =>
        ethers.getContractFactory(contractName, {
          signer: deployer,
          libraries: {
            "contracts/libs/SafeDecimalMath.sol:SafeDecimalMath": output.safeDecimalMath as string,
          },
        })
      )
    )

    const liquidation = (await upgrades.deployProxy(
      LiquidationFactory,
      [
        output.BuildBurnSystem, // _BuildBurnSystem
        output.CollateralSystem, // _CollateralSystem
        output.Config, // _Config
        output.DebtSystem, // _DebtSystem
        output.Prices, // _Prices
        admin.address, // _admin
      ],
      {
        initializer: "initialize",
        unsafeAllowLinkedLibraries: true,
      }
    )) as Liquidation
    logger.info("Liquidation proxy deployed to:", liquidation.address)
    output.Liquidation = liquidation.address
    contractsMap.Liquidation = liquidation
    logger.info("Updating Liquidation Prices field...")
    await liquidation.setPrices(
      output.Prices as string // newLnPrices
    )
  }
}
