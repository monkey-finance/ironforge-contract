/*
1. 测试各个参数的设置是否正确
2. 测试支持铸造的货币是否正确
3. 测试支持的合成资产是否正确
4. 测试加催化剂能否铸造
5. 测试能否交易
6. 测试oracle可以工作
7. 测试各种权限角色设置
 */

import { logger } from "../../utilities/log"
import { settings } from "../common/settings"
import { deployAddresses } from "../../utilities/deployAddresses"
import { DeployedStackResult } from "../deployParamTypes"
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types"
import { zeroAddress } from "../../utilities/constants"
import ERC20Abi from "../../../abi/ERC20.json"
import IronForgeTokenAbi from "../../../abi/IronForgeToken.json"
import { SignKeyObjectInput } from "crypto"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Signer } from "ethers"
async function checkBuild(param: TestParam) {
  logger.info(`checkBuild start ......`)
  logger.info(`deployAddresses.buildTokens ${JSON.stringify(deployAddresses.buildTokens, null, 4)}......`)
  logger.info(`settings.buildTokens ${JSON.stringify(settings.buildTokens, null, 4)}......`)
  const ethers = param.ethers
  const deployer = param.deployer
  const collateralSystem = param.deployed.collateralSystem
  try {
    for (const token of settings.buildTokens) {
      const addr = deployAddresses.buildTokens[token.name]
      logger.debug(`${token.key} : ${addr}`)
      const tokenContract = new ethers.Contract(addr, ERC20Abi, deployer)
      await (await tokenContract.approve(collateralSystem.address, ethers.constants.MaxUint256)).wait()
      // const BSTContract = new ethers.Contract(deployAddresses.platformToken, IronForgeTokenAbi, deployer)
      // await (await BSTContract.approve(collateralSystem.address, ethers.constants.MaxUint256)).wait()
      await collateralSystem.stakeAndBuild(
        ethers.utils.formatBytes32String(token.key),
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("0.0001"),
        ethers.utils.parseEther("0")
      )
    }
  } catch (e) {
    logger.error(e)
  }
}

async function checkDeployTokens(param: TestParam) {
  logger.info(`checkDeployTokens......`)
  for (const c of settings.buildTokens) {
    const tokenInfo = await param.deployed.collateralSystem.tokenInfos(param.ethers.utils.formatBytes32String(c.key))
    if (!c.minCollateral.eq(tokenInfo.minCollateral)) {
      logger.error(`expect ${c.key} minCollateral ${c.minCollateral} eq config ${tokenInfo.minCollateral}`)
    }
    if (c.close !== tokenInfo.bClose) {
      logger.error(`expect ${c.key} close ${c.close} eq config ${tokenInfo.bClose}`)
    }
    if (param.deployed.output.buildTokens[c.name] !== tokenInfo.tokenAddress) {
      logger.error(
        `expect ${c.key} tokenAddress ${param.deployed.output.buildTokens[c.name]} eq config ${tokenInfo.tokenAddress}`
      )
    }
  }
}

async function checkPancakeAndLp(param: TestParam) {
  logger.info(`checkPancakeAndLp......`)
  const addr = await param.deployed.pancakeFactory.getPair(
    await param.deployed.lp_usdc_BST.token0(),
    await param.deployed.lp_usdc_BST.token1()
  )
  logger.debug(
    `pancakeFactory: ${param.deployed.pancakeFactory.address}, lp: ${param.deployed.lp_usdc_BST.address}, pancakeRouter:${param.deployed.pancakeRouter.address}`
  )
  if (addr !== param.deployed.lp_usdc_BST.address) {
    logger.error(`expect pancakeFactory ${param.deployed.pancakeFactory.address} has pair ${addr}`)
  }

  const routerFactoryAddress = await param.deployed.pancakeRouter.factory()
  if (routerFactoryAddress !== param.deployed.pancakeFactory.address) {
    logger.error(
      `expect routerFactoryAddress  ${routerFactoryAddress} eq pancakeFactory.address ${param.deployed.pancakeFactory.address}`
    )
  }
}

async function checkSynths(param: TestParam) {
  logger.info(`checkSynths......`)

  const assetAddresses = await param.deployed.assetSystem.getAssetAddresses()
  for (const assetAddress of assetAddresses) {
    logger.debug(`assetAddress ${assetAddress}`)
  }

  for (const synth of settings.synths) {
    const addr = await param.deployed.assetSystem.getAddress(param.ethers.utils.formatBytes32String(synth.key))
    logger.info(`synth ${synth.key} addr: ${addr}`)
    if (addr === zeroAddress) {
      logger.error(`storage do not have ${synth.key} addr: ${addr}`)
    }
  }
}

async function checkConfigAfterDeploy(param: TestParam) {
  logger.info(`checkConfigAfterDeploy......`)
  for (const c of settings.config) {
    logger.info(`${c.key}, ${param.ethers.utils.formatBytes32String(c.key)}......`)
    const value = await param.deployed.config.getUint(param.ethers.utils.formatBytes32String(c.key))
    if (!value.eq(c.value)) {
      logger.error(`expect ${c.key} ${value} eq config ${c.value}`)
    }
  }
}

async function checkBuildRatioAfterDeploy(param: TestParam) {
  logger.info(`checkBuildRatioAfterDeploy......`)
  for (const c of settings.buildTokens) {
    const value = await param.deployed.config.getBuildRatio(param.ethers.utils.formatBytes32String(c.key))
    if (!value.eq(c.buildRatio)) {
      logger.error(`expect ${c.key} ${value} eq config ${c.buildRatio}`)
    }
  }
}

async function checkOracleServerRole(param: TestParam) {
  logger.info(`checkOracleServerRole......`)
  const has = await param.deployed.accessControl.hasRole(
    param.ethers.utils.formatBytes32String(settings.oracle.ORACLE_SERVER_ROLE_KEY),
    settings.oracle.ORACLE_SERVER_ROLE_ADDRESS
  )
  if (!has) {
    logger.error(
      `expect ${settings.oracle.ORACLE_SERVER_ROLE_ADDRESS} has ${settings.oracle.ORACLE_SERVER_ROLE_KEY} role`
    )
  }
}

export interface TestParam {
  deployer: Signer
  ethers: typeof import("ethers/lib/ethers") & HardhatEthersHelpers
  deployed: DeployedStackResult
}

export async function testAfterDeploy(param: TestParam) {
  await checkConfigAfterDeploy(param)
  await checkBuildRatioAfterDeploy(param)
  if (process.env.HARDHAT_NETWORK != "localhost") await checkOracleServerRole(param)
  await checkDeployTokens(param)
  await checkPancakeAndLp(param)
  await checkSynths(param)
  // await checkBuild(param)
}
