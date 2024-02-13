import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import CollateralSystemAbi from "../abi/CollateralSystem.json"
import IPricesAbi from "../abi/IPrices.json"
import AssetSystemAbi from "../abi/AssetSystem.json"
import DebtSystemAbi from "../abi/DebtSystem.json"
import ERC20Abi from "../abi/ERC20.json"
import IronForgeTokenAbi from "../abi/IronForgeToken.json"
import { AssetSystem, CollateralSystem, DebtSystem, IPrices } from "../typechain"
import { logger } from "../scripts/utilities/log"
import { task } from "hardhat/config"
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types"

async function checkOracle(ethers: typeof import("ethers/lib/ethers") & HardhatEthersHelpers, prices: IPrices) {
  logger.info(`lBTC - ${ethers.utils.formatBytes32String("lBTC")}`)
  const btcPrice = await prices.getPrice(ethers.utils.formatBytes32String("lBTC"))
  logger.info(`btcPriceis ${btcPrice.toString()}`)
  logger.info(`lETH - ${ethers.utils.formatBytes32String("lETH")}`)
  const ethPrice = await prices.getPrice(ethers.utils.formatBytes32String("lETH"))
  logger.info(`ethPrice ${ethPrice.toString()}`)

  logger.info(`USDC - ${ethers.utils.formatBytes32String("USDC")}`)
  const usdcPrice = await prices.getPrice(ethers.utils.formatBytes32String("USDC"))
  logger.info(`usdcPrice ${usdcPrice.toString()}`)

  const BSTPrice = await prices.getPrice(ethers.utils.formatBytes32String("BST"))
  logger.info(`BSTPrice ${BSTPrice.toString()}`)
  const fusdPrice = await prices.getPrice(ethers.utils.formatBytes32String("FUSD"))
  logger.info(`fusdPrice ${fusdPrice.toString()}`)
  const BTCUSD_210924Price = await prices.getPrice(ethers.utils.formatBytes32String("lBTCUSD_210924"))
  logger.info(`lBTCUSD_210924 Price ${BTCUSD_210924Price.toString()}`)
  const BTCUSD_211231Price = await prices.getPrice(ethers.utils.formatBytes32String("lBTCUSD_211231"))
  logger.info(`lBTCUSD_211231 Price ${BTCUSD_211231Price.toString()}`)
}

export const cmdBuild = task("a-build-lbtc").setAction(async function ({}, { ethers, run }) {
  logger.info(`collateralSystem build start`)
  const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
  logger.info(`user balance is ${await user.getBalance()}`)

  const prices = new ethers.Contract(deployAddresses.Prices, IPricesAbi, user) as IPrices
  await checkOracle(ethers, prices)

  const assetSystem = new ethers.Contract(deployAddresses.AssetSystem, AssetSystemAbi, user) as AssetSystem
  const totalAssetsInUsd = await assetSystem.totalAssetsInUsd()
  logger.info(`deployAddresses.AssetSystem: ${deployAddresses.AssetSystem}, totalAssetsInUsd: ${totalAssetsInUsd}`)
  const debtSystem = new ethers.Contract(deployAddresses.DebtSystem, DebtSystemAbi, user) as DebtSystem
  const usdcDebt = await debtSystem.GetUserDebtBalanceInUsd(user.address, ethers.utils.formatBytes32String("USDC"))
  logger.info(`deployAddresses.DebtSystem: ${deployAddresses.DebtSystem}, usdcDebt: ${usdcDebt}`)

  logger.info(`deployAddresses.CollateralSystem: ${deployAddresses.CollateralSystem}`)
  const collateralSystemContract = new ethers.Contract(
    deployAddresses.CollateralSystem,
    CollateralSystemAbi,
    user
  ) as CollateralSystem
  try {
    const tokenContract = new ethers.Contract(deployAddresses.buildTokens.usdcToken, ERC20Abi, user)
    await (await tokenContract.approve(collateralSystemContract.address, ethers.constants.MaxUint256)).wait()
    const BSTContract = new ethers.Contract(deployAddresses.platformToken, IronForgeTokenAbi, user)
    await (await BSTContract.approve(collateralSystemContract.address, ethers.constants.MaxUint256)).wait()
    const lbtcToken = new ethers.Contract(deployAddresses.synths.lBTC, ERC20Abi, user)
    await (await lbtcToken.approve(collateralSystemContract.address, ethers.constants.MaxUint256)).wait()
    logger.info(`stakeAndBuildNonFUSD`)

    const rsp = await (
      await collateralSystemContract.stakeAndBuildNonFUSD(
        ethers.utils.formatBytes32String("USDC"),
        ethers.utils.parseEther("100000"),
        ethers.utils.formatBytes32String("lBTC"),
        ethers.utils.parseEther("0.001"),
        ethers.utils.parseEther("0")
      )
    ).wait(1)

    const fromContract = new ethers.Contract(deployAddresses.synths.FUSD, ERC20Abi, user)
    logger.info(`user FUSD balance is ${await fromContract.balanceOf(user.address)}`)
    logger.info(`transactionHash ${rsp.transactionHash}`)
  } catch (e) {
    logger.error(e)
  }

  logger.info(`collateralSystem build end`)
})

export const cmdBuildFusd = task("a-build-fusd").setAction(async function ({}, { ethers, run }) {
  logger.info(`collateralSystem build start`)
  const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
  logger.info(`user balance is ${await user.getBalance()}`)

  const prices = new ethers.Contract(deployAddresses.Prices, IPricesAbi, user) as IPrices
  await checkOracle(ethers, prices)

  const assetSystem = new ethers.Contract(deployAddresses.AssetSystem, AssetSystemAbi, user) as AssetSystem
  const totalAssetsInUsd = await assetSystem.totalAssetsInUsd()
  logger.info(`deployAddresses.AssetSystem: ${deployAddresses.AssetSystem}, totalAssetsInUsd: ${totalAssetsInUsd}`)
  const debtSystem = new ethers.Contract(deployAddresses.DebtSystem, DebtSystemAbi, user) as DebtSystem
  const usdcDebt = await debtSystem.GetUserDebtBalanceInUsd(user.address, ethers.utils.formatBytes32String("USDC"))
  logger.info(`deployAddresses.DebtSystem: ${deployAddresses.DebtSystem}, usdcDebt: ${usdcDebt}`)

  logger.info(`deployAddresses.CollateralSystem: ${deployAddresses.CollateralSystem}`)
  const collateralSystemContract = new ethers.Contract(
    deployAddresses.CollateralSystem,
    CollateralSystemAbi,
    user
  ) as CollateralSystem
  try {
    const tokenContract = new ethers.Contract(deployAddresses.buildTokens.usdcToken, ERC20Abi, user)
    await (await tokenContract.approve(collateralSystemContract.address, ethers.constants.MaxUint256)).wait()
    const BSTContract = new ethers.Contract(deployAddresses.platformToken, IronForgeTokenAbi, user)
    await (await BSTContract.approve(collateralSystemContract.address, ethers.constants.MaxUint256)).wait()
    const lbtcToken = new ethers.Contract(deployAddresses.synths.lBTC, ERC20Abi, user)
    await (await lbtcToken.approve(collateralSystemContract.address, ethers.constants.MaxUint256)).wait()
    logger.info(`stakeAndBuild`)
    const rsp = await (
      await collateralSystemContract.stakeAndBuild(
        ethers.utils.formatBytes32String("USDC"),
        ethers.utils.parseEther("100000"),
        ethers.utils.parseEther("1000"),
        ethers.utils.parseEther("0")
      )
    ).wait(1)

    const fromContract = new ethers.Contract(deployAddresses.synths.FUSD, ERC20Abi, user)
    logger.info(`user FUSD balance is ${await fromContract.balanceOf(user.address)}`)
    logger.info(`transactionHash ${rsp.transactionHash}`)
  } catch (e) {
    logger.error(e)
  }

  logger.info(`collateralSystem build end`)
})
