// await minerReward.addPool(1, platformToken.address, linearRelease.address, 0)

import { task, types } from "hardhat/config"
import { logger } from "../scripts/utilities/log"
import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import CollateralSystemAbi from "../abi/CollateralSystem.json"
import AssetSystemAbi from "../abi/AssetSystem.json"
import ConfigAbi from "../abi/Config.json"
import { CollateralSystem, AssetUpgradeable } from "../typechain"
import OracleRouterAbi from "../abi/OracleRouter.json"
import { OracleRouter } from "../typechain"
import { Duration } from "luxon"
import EACAggregatorProxyAbi from "../scripts/abis/EACAggregatorProxy.json"
import QuarterlyContractOracle from "../abi/QuarterlyContractOracle.json"
import { expandTo18Decimals } from "../scripts/utilities"
const ORACLE_TYPE_CHAINLINK = 1
const ORACLE_TYPE_QUARTERLY_CONTRACT = 2

export const cmdQueryCollateralToken = task("a-queryCollateralToken")
  .setAction(async function ({ token }, { ethers, run }) {
    logger.info(`cmdQueryCollateralToken start...`)
    const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)

    try {
      const collateralSystem = new ethers.Contract(
        deployAddresses.CollateralSystem,
        CollateralSystemAbi,
        user
      ) as CollateralSystem
      const tokenInfo = await collateralSystem.tokenInfos(ethers.utils.formatBytes32String(token))
      console.log("cmdQueryCollateralToken: ", tokenInfo)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdQueryCollateralToken end`)
  })
  .addParam("token", "token symbol")

/** update or add build token info */
export const cmdUpdateCollateralToken = task("a-updateCollateralToken")
  .setAction(async function ({ token, address, min, close }, { ethers, run }) {
    logger.info(`cmdUpdateCollateralToken start...`)
    const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)

    try {
      const collateralSystem = new ethers.Contract(
        deployAddresses.CollateralSystem,
        CollateralSystemAbi,
        user
      ) as CollateralSystem
      const res = await (
        await collateralSystem.updateTokenInfo(
          ethers.utils.formatBytes32String(token),
          address,
          ethers.utils.parseEther(min),
          close
        )
      ).wait(1)
      logger.info(`transactionHash ${res.transactionHash}`)
    } catch (e) {
      logger.error(e)
    }
    if (!deployAddresses.buildTokens[token]) {
      //@ts-ignore
      deployAddresses.buildTokens[token] = address
      await writeOutput(deployAddresses)
    }

    logger.info(`cmdUpdateCollateralToken end`)
  })
  .addParam("token", "token symbol")
  .addParam("address", "token address")
  .addParam("min", "the min collateral value")
  .addParam("close", "if forbid this token", false, types.boolean)

export const cmdAddMintToken = task("a-addMintToken")
  .setAction(async function ({ token, fee, stalePeriod, aggregatorAddress }, { ethers, run, upgrades }) {
    logger.info(`cmdAddMintToken start...`)
    const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
    const AssetUpgradeableFactory = await ethers.getContractFactory("AssetUpgradeable", deployer)
    const assetSystem = new ethers.Contract(deployAddresses.AssetSystem, AssetSystemAbi, deployer)
    const config = new ethers.Contract(deployAddresses.Config, ConfigAbi, deployer)
    const oracleRouter = new ethers.Contract(deployAddresses.Prices, OracleRouterAbi, deployer) as OracleRouter

    try {
      if (aggregatorAddress) {
        //deploy chainlink oracle
        // Double check to make sure we're not using the wrong aggregator
        const aggregator = new ethers.Contract(aggregatorAddress, EACAggregatorProxyAbi, deployer)

        const aggregatorDescription: string = await aggregator.connect(ethers.provider).description()
        if (aggregatorDescription != `${token.substr(1)} / USD`) {
          logger.info(`${token} : aggregator description mismatch...`)
          return
        }

        // Make sure the currency isn't already set to use Chainlink
        const oracleSettings = await oracleRouter.oracleSettings(ethers.utils.formatBytes32String(token))
        if (oracleSettings.oracleType === ORACLE_TYPE_CHAINLINK) {
          logger.info(`${token} already used Chainlink...`)
        } else {
          logger.info("Set oracle to Chainlink...")
          await oracleRouter.addChainlinkOracle(
            ethers.utils.formatBytes32String(token), // currencyKey
            aggregatorAddress, // oracleAddress
            true // removeExisting
          )
        }

        logger.info(`Setting stale period to ${stalePeriod} hours...`)
        await oracleRouter.setStalePeriodOverride(
          ethers.utils.formatBytes32String(token), // currencyKey
          Duration.fromObject({ hours: stalePeriod }).as("seconds") // newStalePeriod
        )
      } else {
        // deploy quarterly contract
        const quarterlyContractOracle = new ethers.Contract(
          deployAddresses.QuarterlyContractOracle,
          QuarterlyContractOracle,
          deployer
        )
        // Make sure the currency isn't already set to use Quarterly Contract Oracle
        const oracleSettings = await oracleRouter.oracleSettings(ethers.utils.formatBytes32String(token))
        if (oracleSettings.oracleType === ORACLE_TYPE_QUARTERLY_CONTRACT) {
          logger.info(`${token} already used Quarterly Contract Oracle...`)
        } else {
          logger.info(`quarterlyContractName : ${token}`)
          await oracleRouter.connect(deployer).addQuarterlyContractOracle(
            ethers.utils.formatBytes32String(token), // currencyKey
            quarterlyContractOracle.address, // oracleAddress
            false // removeExisting
          )
        }

        logger.info(`Setting stale period to ${stalePeriod} hours...`)
        await oracleRouter.setStalePeriodOverride(
          ethers.utils.formatBytes32String(token), // currencyKey
          Duration.fromObject({ hours: stalePeriod }).as("seconds") // newStalePeriod
        )
      }
      logger.info(`Start deploying ${token} ...`)

      const tokenProxy = (await upgrades.deployProxy(
        AssetUpgradeableFactory,
        [
          token, // _name,
          token, // _symbol
          deployer.address, // _admin
        ],
        {
          initializer: "initialize",
        }
      )) as AssetUpgradeable
      await tokenProxy.deployed()

      await (await assetSystem.connect(deployer).addAsset(tokenProxy.address)).wait(1)
      logger.info(`${token} deployed to ${tokenProxy.address}`)
      await tokenProxy.connect(deployer).updateAddressCache(assetSystem.address)
      logger.info(`${token} updateAddressCache`)
      deployAddresses.synths[token] = tokenProxy.address
      await writeOutput(deployAddresses)
      logger.info(`${token} setUint value :${fee}`)
      await config.connect(deployer).setUint(
        ethers.utils.formatBytes32String(token), // key
        expandTo18Decimals(fee) // exchange fee
      )
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdAddMintToken end`)
  })
  .addParam("token", "token symbol")
  .addParam("fee", "token exchange fee")
  .addParam("stalePeriod", "Hours of price stale period")
  .addOptionalParam(
    "aggregatorAddress",
    "aggregator address of chainlink oracle. If this param is not set, means to add quarterly contract"
  )

export const cmdForbidToken = task("a-forbidToken")
  .setAction(async function ({ token, forbid }, { ethers, run }) {
    logger.info(`cmdForbidToken start...`)
    try {
      const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
      logger.info(`user balance is ${await user.getBalance()}`)
      const assetSystem = new ethers.Contract(deployAddresses.AssetSystem, AssetSystemAbi, user)
      const res = await (await assetSystem.setForbidAsset(ethers.utils.formatBytes32String(token), forbid)).wait(1)
      logger.info(`transactionHash ${res.transactionHash}`)
      const isForbidden = await assetSystem.isForbidden(ethers.utils.formatBytes32String(token))
      console.log(`token is forbidden: `, isForbidden)
    } catch (e) {
      logger.error(e)
    }

    logger.info(`cmdForbidToken end`)
  })
  .addParam("token", "token symbol to set forbid")
  .addParam("forbid", "forbid or not", true, types.boolean)

export const writeOutput = async (output: any) => {
  const fs = require("fs")
  const env = process.env.NODE_ENV
  let fileName
  if (env === "test") {
    fileName = "global.bsctestnet.json"
  } else if (env === "prod") {
    fileName = "global.bscmainnet.json"
  }
  fs.writeFileSync(fileName, JSON.stringify(output, null, 4))
}
