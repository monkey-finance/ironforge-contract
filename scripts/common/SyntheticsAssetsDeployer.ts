import { ethers, upgrades } from "hardhat"
import { logger } from "../utilities/log"

import {
  AccessControl,
  AssetSystem,
  AssetUpgradeable,
  AssetUpgradeable__factory,
  BuildBurnSystem,
  Config,
} from "../../typechain"
import { settings } from "../bscmainnet/settings.mainnet"
import BuildBurnSystemAbi from "../../abi/BuildBurnSystem.json"
import { DeployTemplate } from "./deployTemplate"
export class SyntheticsAssetsDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    logger.info(`deploy core system start......\n${JSON.stringify(this.output, null, 4)}`)
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer

    const assetSystemFactory = await ethers.getContractFactory("AssetSystem", this.deployer)
    const assetSystem = assetSystemFactory.attach(output.AssetSystem as string)
    const configFactory = await ethers.getContractFactory("Config", this.deployer)
    const config = configFactory.attach(output.Config as string)

    const buildBurnSystem = await ethers.getContractAt(BuildBurnSystemAbi, output.BuildBurnSystem as string)
    output.synths = {}
    await assetSystem
      .connect(admin)
      .updateAll([ethers.utils.formatBytes32String("AccessControl")], [output.AccessControl])

    const AssetUpgradeableFactory = await ethers.getContractFactory("AssetUpgradeable", deployer)
    let tokens: Map<string, AssetUpgradeable> = new Map<string, AssetUpgradeable>()
    for (const synth of settings.synths) {
      const token = (await upgrades.deployProxy(
        AssetUpgradeableFactory,
        [
          synth.key, // _name,
          synth.key, // _symbol
          admin.address, // _admin
        ],
        {
          initializer: "initialize",
        }
      )) as AssetUpgradeable
      await token.deployed()
      await (await assetSystem.connect(admin).addAsset(token.address)).wait(1)
      logger.info(`${synth.key} ${await token.symbolBytes32()} deployed to ${token.address}`)
      await token.connect(admin).updateAddressCache(assetSystem.address)
      logger.info(`${synth.key} updateAddressCache`)
      output.synths[synth.key] = token.address
      tokens.set(synth.key, token)
      contractsMap[synth.key] = token
      logger.info(`${synth.key} setUint synth.value :${synth.value.toString()}`)
      await config.connect(admin).setUint(
        ethers.utils.formatBytes32String(synth.key), // key
        synth.value // exchange fee
      )
    }

    /**
     * Register FUSD on `BuildBurnSystem`
     */
    logger.info(`Register FUSD on BuildBurnSystem`)
    await buildBurnSystem.connect(admin).SetLusdTokenAddress(output.synths["FUSD"])
    logger.info(" Register synth assets on `AssetSystem`")
  }
}
