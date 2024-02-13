import { ethers, upgrades } from "hardhat"
import { DeployTemplate } from "../common/deployTemplate"
import { logger } from "../utilities/log"
import {
  AccessControl,
  AssetSystem,
  AssetUpgradeable,
  AssetUpgradeable__factory,
  BuildBurnSystem,
  CollateralSystem,
  Config,
  DebtSystem,
  ExchangeSystem,
  IronForgeToken,
  LinearRelease,
  Liquidation,
  MinerReward,
  MockERC20,
  PancakeFactory,
  PancakePair,
  PancakeRouterV2,
  PublicCatalystMath,
  RewardSystem,
  Timelock__factory,
} from "../../typechain"
import { zeroAddress } from "../utilities"


export class CoreSystemDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    logger.info(`deploy core system start......\n${JSON.stringify(this.output, null, 4)}`)
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer

    // Load contract factories without external libraries
    const [
      AccessControlFactory,
      AssetUpgradeableFactory,
      ConfigFactory,
      RewardSystemFactory,
      MinerRewardFactory,
      LinearReleaseFactory,
    ] = await Promise.all(
      ["AccessControl", "AssetUpgradeable", "Config", "RewardSystem", "MinerReward", "LinearRelease"].map(
        (contractName) => ethers.getContractFactory(contractName, deployer)
      )
    )

    const safeDecimalMath = output.safeDecimalMath as string
    // Load contract factories with external libraries
    const [
      CollateralSystemFactory,
      BuildBurnSystemFactory,
      DebtSystemFactory,
      ExchangeSystemFactory,
      LiquidationFactory,
    ] = await Promise.all(
      ["CollateralSystem", "BuildBurnSystem", "DebtSystem", "ExchangeSystem", "Liquidation"].map((contractName) =>
        ethers.getContractFactory(contractName, {
          signer: deployer,
          libraries: {
            "contracts/libs/SafeDecimalMath.sol:SafeDecimalMath": safeDecimalMath,
          },
        })
      )
    )
    const catalystMath = output.catalystMath as string
    const [PublicCatalystMathFactory] = await Promise.all(
      ["PublicCatalystMath"].map((contractName) =>
        ethers.getContractFactory(contractName, {
          signer: deployer,
          libraries: {
            "contracts/libs/CatalystMath.sol:CatalystMath": catalystMath,
          },
        })
      )
    )

    const publicCatalystMath = (await PublicCatalystMathFactory.deploy()) as PublicCatalystMath
    output.publicCatalystMath = publicCatalystMath.address
    contractsMap.publicCatalystMath = publicCatalystMath
    /**
     * The contract for controlling issuance and burning of synthetic assets
     */
    const buildBurnSystem = (await upgrades.deployProxy(
      BuildBurnSystemFactory,
      [
        admin.address, // admin
        zeroAddress, // _FUSDTokenAddr
      ],
      {
        initializer: "initialize",
        unsafeAllowLinkedLibraries: true,
      }
    )) as BuildBurnSystem
    logger.info("BuildBurnSystem proxy deployed to:", buildBurnSystem.address)
    output["BuildBurnSystem"] = buildBurnSystem.address
    contractsMap.BuildBurnSystem = buildBurnSystem

    /**
     * A contract for role-based access control
     */
    const accessControl = (await upgrades.deployProxy(
      AccessControlFactory,
      [
        admin.address, // admin
      ],
      {
        initializer: "initialize",
      }
    )) as AccessControl
    logger.info("AccessControl proxy deployed to:", accessControl.address)
    output.AccessControl = accessControl.address
    contractsMap.AccessControl = accessControl

    const debtSystem = (await upgrades.deployProxy(DebtSystemFactory, [admin.address], {
      initializer: "initialize",
      unsafeAllowLinkedLibraries: true,
    })) as DebtSystem
    logger.info("DebtSystem proxy deployed to:", debtSystem.address)
    output.DebtSystem = debtSystem.address
    contractsMap.DebtSystem = debtSystem

    /**
     * A contract for storing configuration values
     */
    const config = (await upgrades.deployProxy(ConfigFactory, [], {
      initializer: "initialize",
    })) as Config
    logger.info("Config proxy deployed to:", config.address)
    output["Config"] = config.address
    contractsMap.Config = config

    const exchangeSystem = (await upgrades.deployProxy(
      ExchangeSystemFactory,
      [
        admin.address, // _admin
      ],
      {
        initializer: "initialize",
        unsafeAllowLinkedLibraries: true,
      }
    )) as ExchangeSystem
    logger.info("ExchangeSystem proxy deployed to:", exchangeSystem.address)
    output.ExchangeSystem = exchangeSystem.address
    contractsMap.ExchangeSystem = exchangeSystem

    const TimelockFactory = (await ethers.getContractFactory("Timelock", deployer)) as Timelock__factory
    //TODO confirm 2 day
    const timelock = await TimelockFactory.deploy(await admin.getAddress(), "259200")
    await timelock.deployed()
    output.Timelock = timelock.address
    contractsMap.TimeLock = timelock
    logger.info("Timelock proxy deployed to:", timelock.address)
  }
}
