import {
  AccessControl,
  AssetSystem,
  AssetUpgradeable,
  AssetUpgradeable__factory,
  BuildBurnSystem,
  Config,
} from "../../../typechain"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { ethers, upgrades } from "hardhat"
import { logger } from "../../utilities/log"
import { settings } from "./settings"
import { expandTo18Decimals } from "../../utilities"

export async function createSyntheticAssets(
  AssetUpgradeableFactory: AssetUpgradeable__factory,
  admin: SignerWithAddress,
  output: Record<string, any>,
  assetSystem: AssetSystem,
  buildBurnSystem: BuildBurnSystem,
  config: Config,
  accessControl: AccessControl
) {
  logger.info("Create the base synthetic asset start ...")
  output.synths = {}
  await assetSystem
    .connect(admin)
    .updateAll([ethers.utils.formatBytes32String("AccessControl")], [accessControl.address])

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
  return tokens
}
