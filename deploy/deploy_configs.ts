import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DateTime, Duration } from "luxon"
import { DeployFunction, DeploymentSubmission, DeployResult } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import CollateralSystemAbi from "../abi/CollateralSystem.json"
import ExchangeSystem from "../abi/ExchangeSystem.json"
import Config from "../abi/Config.json"
import PricesAbi from "../abi/MockPrices.json"
import { BigNumber, Contract } from "ethers"
import { expandTo18Decimals, uint256Max } from "../test/utilities"
import DevContracts from "../global.dev.json"
import TestnetContracts from "../global.bsctestnet.json"
import PancakeRouter from "../abi/PancakeRouterV2.json"
import PancakeFactory from "../abi/PancakeFactory.json"
import PancakePair from "../abi/PancakePair.json"
import MinerReward from "../abi/MinerReward.json"
import PlatformToken from "../abi/IronForgeToken.json"
import ERC20 from "../abi/ERC20.json"
import AssetSystem from "../abi/AssetSystem.json"
import DebtSystem from "../abi/DebtSystem.json"
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log(hre.network.name)
  const Contracts = hre.network.name === "localhost" ? DevContracts : TestnetContracts
  console.log(`\n\n>> deploy/deploy_erc20.ts`)
  const { deployments, network, getNamedAccounts, getUnnamedAccounts } = hre
  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  const deployingTokens = async function (name: string, symbol: string) {
    console.log(`>> Deploying Token name:${name}, symbol:${symbol}`)
    const MockERC20 = "MockERC20"

    const result = (await deploy(MockERC20, {
      from: deployer,
      contract: MockERC20,
      args: [name, symbol],
      log: true,
      deterministicDeployment: false,
    })) as DeployResult

    console.log(`>> ${name} deployed at: ${result.address}`)
    const token = await ethers.getContractAt(MockERC20, result.address)
    console.log(`>> Minting 1,000,000,000 ${symbol}`)
    await token.mint(deployer, ethers.utils.parseEther("1000000000"), {
      gasLimit: "210000",
    })
    console.log("✅ Done")

    return result.address
  }
  //update collateralSystem token infos
  const updateTokenInfo = async (symbol: string, contractAddress: string, amount: number | BigNumber) => {
    const CollateralSystemContract = Contracts.CollateralSystem
    const CollateralSystem = await ethers.getContractAt(CollateralSystemAbi, CollateralSystemContract)

    await CollateralSystem.updateTokenInfos(
      [ethers.utils.formatBytes32String(symbol)],
      [contractAddress],
      [amount],
      [false]
    )
    console.log(`>>> Update token(${symbol}) info done.`)
  }

  const setPrices = async (symbol: string, amount: number) => {
    const PriceSystemContract = Contracts.Prices
    const PricesContract = await ethers.getContractAt(PricesAbi, PriceSystemContract)
    await PricesContract.setPrice(
      ethers.utils.formatBytes32String(symbol), // currencyKey
      expandTo18Decimals(amount) // price
    )
    console.log(`>>> Set price of ${symbol} to ${amount}`)
  }

  const setPriceStalePeriod = async (hours: number) => {
    const PricesContract = await ethers.getContractAt(PricesAbi, Contracts.Prices)
    const res = await PricesContract.setStalePeriod(
      Duration.fromObject({ hours: hours }).as("seconds") // _stalePeriod
    )
    console.log(res)
    console.log("setPriceStalePeriod done.")
  }

  const getPrice = async (symbol: string) => {
    const PriceSystemContract = Contracts.Prices
    const PricesContract = await ethers.getContractAt(PricesAbi, PriceSystemContract)
    const res = await PricesContract.getPrice(
      ethers.utils.formatBytes32String(symbol) // currencyKey
    )
    console.log(`>>> Get price of ${symbol}: `, res.toString())
  }

  const addLiquidity = async (
    token1: string,
    token2: string,
    amount1: BigNumber,
    amount2: BigNumber,
    lpName: string
  ) => {
    const deadline = 2000000000
    const token1Contract = await ethers.getContractAt(ERC20, token1)
    const token2Contract = await ethers.getContractAt(ERC20, token2)
    await token1Contract.approve(Contracts.pancakeRouter, amount1)
    await token2Contract.approve(Contracts.pancakeRouter, amount2)
    const router = await ethers.getContractAt(PancakeRouter, Contracts.pancakeRouter)
    const res = await router.addLiquidity(token1, token2, amount1, amount2, 0, 0, deployer, deadline)
    console.log("addLiquidity: ", res)
    await res.wait()
    const factory = await ethers.getContractAt(PancakeFactory, Contracts.pancakeFactory)
    const pair = await factory.getPair(token1, token2)
    console.log("lp pair: ", pair)
    const lp = await ethers.getContractAt(PancakePair, pair)
    const balance = await lp.balanceOf(deployer)
    console.log("lp balance: ", ethers.utils.formatEther(balance.toString()))

    const fs = require("fs")
    //@ts-ignore
    Contracts[lpName] = pair
    const name = hre.network.name
    const fileName = name === "bsc-testnet" ? "global.bsctestnet.json" : "global.dev.json"
    fs.writeFileSync(fileName, JSON.stringify(Contracts, null, 4))
  }

  // await getDexPrice(Contracts.usdcToken, Contracts.PlatformToken)

  // await addLiquidity(
  //   Contracts.buildTokens.ethToken,
  //   Contracts.buildTokens.usdcToken,
  //   ethers.utils.parseEther("100"),
  //   ethers.utils.parseEther("10000"),
  //   "USDC-ETH"
  // )

  const addStakePool = async (lpAddress: string, allocPoints: number) => {
    // console.log("addPool: ", lpAddress, allocPoints)
    const minerReward = await ethers.getContractAt(MinerReward, Contracts.MinerReward)
    // const tx = await minerReward.addPool(allocPoints, lpAddress, Contracts.LinearRelease, 0)
    // await tx.wait()
    const poolLength = await minerReward.poolLength()
    const pool = await minerReward.poolInfo(poolLength - 1)
    console.log("added new pool id: ", poolLength - 1)
    console.log("added pool allocPoints: ", pool.allocPoint.toString())
  }

  const revertPendingEntry = async (entries: number[]) => {
    const exchange = await ethers.getContractAt(ExchangeSystem, Contracts.ExchangeSystem)
    try {
      await exchange.rollback(1000)
    } catch (err) {
      console.log(err)
    }

    for (let i = 0; i < entries.length; i++) {}
    console.log("revert success.")
  }

  // await revertPendingEntry([1000])

  // add stake pools for platform tokens
  // 30% reward for mint locked
  // await addStakePool(Contracts.platformToken, 1) // 催化剂锁仓, 注意部署脚本中已经添加过了

  await addStakePool(Contracts.platformToken, 3) // 单币池
  // await addStakePool(Contracts["USDC-BST"], 3)
  // //@ts-ignore
  // await addStakePool(Contracts["USDC-ETH"], 3)

  const initializeMinerReward = async () => {
    const platformToken = await ethers.getContractAt(PlatformToken, Contracts.platformToken)
    const minerReward = await ethers.getContractAt(MinerReward, Contracts.MinerReward)
    const length = await minerReward.poolLength()
    console.log("poolInfo: ", length)
    await (await platformToken.transferOwnership(minerReward.address)).wait()
    // await platformToken.connect(minerReward.address).manulMint(minerReward.address, ethers.utils.parseEther("100"))
    // const balance = ethers.utils.formatEther(await platformToken.balanceOf(minerReward.address))
    // console.log("balance: ", balance)
  }
  // await initializeMinerReward()

  const checkExchangeReward = async () => {
    const minerReward = await ethers.getContractAt(MinerReward, Contracts.MinerReward)
    // await minerReward.setExchangeRewardInfo(0, expandTo18Decimals(0.01), expandTo18Decimals(10000))
    const configInfo = await minerReward.exchangeRewardInfo(0)
    console.log(
      "configInfo: ",
      ethers.utils.formatEther(configInfo.rate),
      ethers.utils.formatEther(configInfo.totalReward),
      ethers.utils.formatEther(configInfo.rewardSent)
    )
  }

  const checkExchangeDelay = async (entryId: number) => {
    const exchange = await ethers.getContractAt(ExchangeSystem, Contracts.ExchangeSystem)
    const lastId = await exchange.lastPendingExchangeEntryId()
    console.log("last entry: ", lastId.toNumber())

    const isPassed = await exchange.settlementDelayPassed(lastId)

    const entry = await exchange.pendingExchangeEntries(lastId)
    console.log("entry: ", entry.timestamp.toNumber())
    console.log("isPassed: ", isPassed)
    const canRevert = await exchange.canOnlyBeReverted(lastId)
    console.log("canRevert: ", canRevert)

    const config = await ethers.getContractAt(Config, Contracts.Config)
    const delay = await config.getUint(ethers.utils.formatBytes32String("TradeSettlementDelay"))
    console.log("delay: ", delay.toNumber())
  }

  // await checkExchangeReward()

  // await initializeMinerReward()

  // await checkExchangeDelay(6)

  // const BTC = "BTC"
  // const btcAddress = await deployingTokens(BTC, BTC)
  // await updateTokenInfo(BTC, btcAddress, BigNumber.from(1).div(10000))

  // const USDT = "USDT"
  // const usdtAddress = await deployingTokens(USDT, USDT)
  // await updateTokenInfo(USDT, usdtAddress, 1)

  // await updateTokenInfo("USDC", Contracts.usdcToken, 1)

  // const ETH = "ETH"
  // const ethAddress = await deployingTokens(ETH, ETH)
  //   await updateTokenInfo(ETH, ethAddress, BigNumber.from(1).div(2000))

  // await setPrices("BTC", 8000)
  // await setPrices("ETH", 1000)
  // await setPrices("USDT", 1)
  // await setPrices("USDC", 1)

  // await setPrices("BST", 0.1)

  // await setPrices("lBTC-202112", 10000)

  // await setPriceStalePeriod(48)
  // await setPrices("lBTC", 10000)
  // await setPrices("FUSD", 1)

  // await getPrice("BTC")

  // await updateTokenInfo("USDT", "0x30e4811284a3fd9745BC41DCad13c8E65fDcE16c", 1)
}

export default func
func.tags = ["mockERC20"]
