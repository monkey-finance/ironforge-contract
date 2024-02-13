import { DateTime, Duration } from "luxon"
import { ethers } from "hardhat"
import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { expandTo18Decimals, uint256Max } from "../utilities"
import { getBlockDateTime, setNextBlockTimestamp } from "../utilities/timeTravel"
import { deployWithMockPrice } from "../../scripts/testnet/localhost/deployWithMockPrice"
import { DeployedStackResult } from "../../scripts/testnet/deployParamTypes"
describe("Integration | Exchange", function () {
  this.timeout(30000)
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    settler: SignerWithAddress

  let stack: DeployedStackResult

  const settlementDelay: Duration = Duration.fromObject({ minutes: 1 })
  const revertDelay: Duration = Duration.fromObject({ minutes: 10 })
  const stalePeriod: Duration = Duration.fromObject({ hours: 12 })
  let priceUpdateTime: DateTime

  const setLbtcPrice = async (price: number): Promise<void> => {
    await stack.prices.connect(admin).setPrice(
      ethers.utils.formatBytes32String("lBTC"), // currencyKey
      expandTo18Decimals(price) // price
    )
  }

  const passSettlementDelay = async (): Promise<void> => {
    await setNextBlockTimestamp(ethers.provider, (await getBlockDateTime(ethers.provider)).plus(settlementDelay))
  }

  const settleTrade = (entryId: number): Promise<any> => {
    return stack.exchangeSystem.connect(settler).settle(
      entryId // pendingExchangeEntryId
    )
  }

  const settleTradeWithDelay = async (entryId: number): Promise<any> => {
    await passSettlementDelay()
    await settleTrade(entryId)
  }

  beforeEach(async function () {
    ;[deployer, alice, bob, settler] = await ethers.getSigners()
    admin = deployer
    this.timeout(30000)

    stack = await deployWithMockPrice(deployer, admin)

    priceUpdateTime = await getBlockDateTime(ethers.provider)

    // Set ETH price to $0.01 and lBTC to $20,000
    await stack.prices.connect(admin).setPriceAndTime(
      ethers.utils.formatBytes32String("ETH"), // currencyKey
      expandTo18Decimals(0.01), // price
      priceUpdateTime.toSeconds() // updateTime
    )
    await stack.prices.connect(admin).setPriceAndTime(
      ethers.utils.formatBytes32String("lBTC"), // currencyKey
      expandTo18Decimals(20_000), // price
      priceUpdateTime.toSeconds() // updateTime
    )

    // Set BTC exchange fee rate to 1%
    await stack.config.connect(admin).setUint(
      ethers.utils.formatBytes32String("lBTC"), // key
      expandTo18Decimals(0.01) // value
    )

    // Set exchange reward info
    await stack.minerReward.connect(admin).setExchangeRewardInfo(0, expandTo18Decimals(0.01), expandTo18Decimals(10000))

    // Set settlement delay
    await stack.config.connect(admin).setUint(
      ethers.utils.formatBytes32String("TradeSettlementDelay"), // key
      settlementDelay.as("seconds")
    )

    // Set rollback delay
    await stack.config.connect(admin).setUint(
      ethers.utils.formatBytes32String("TradeRevertDelay"), // key
      revertDelay.as("seconds")
    )

    console.log("Mint 1,000,000 ETH to Alice")
    // Mint 1,000,000 ETH to Alice
    await stack.ethToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))

    console.log("Alice stakes all ETH")
    // Alice stakes all ETH
    await stack.ethToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)
    await stack.collateralSystem
      .connect(alice)
      .stakeAndBuild(
        ethers.utils.formatBytes32String("ETH"),
        expandTo18Decimals(1_000_000),
        expandTo18Decimals(1_000),
        0
      )

    // Mint 1,000,000 BST to Alice
    await stack.platformToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
    await stack.platformToken.connect(admin).transferOwnership(stack.minerReward.address)

    await stack.prices.connect(admin).setStalePeriod(stalePeriod.as("seconds"))
    await stack.fusdToken.connect(alice).approve(stack.exchangeSystem.address, uint256Max)
  })
  context("context no name", async () => {
    it("exchangeReward info is set", async () => {
      const res = await stack.minerReward.connect(admin).exchangeRewardInfo(0)
      console.log(res)
      expect(ethers.utils.formatEther(res.rate)).to.eq("0.01")
      expect(res.totalReward).to.eq(ethers.utils.parseEther("10000"))
      expect(res.rewardSent).to.eq(ethers.utils.parseEther("0"))
    })

    it("fee not splitted when fee holder is not set", async () => {
      // Set fee split ratio to 30%
      await stack.config.connect(admin).setUint(
        ethers.utils.formatBytes32String("FoundationFeeSplit"), // key
        expandTo18Decimals(0.3) // value
      )
      // Alice exchanges 500 FUSD for 0.025 lBTC
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )
      await settleTradeWithDelay(1)

      // All fees (0.025 * 0.01 * 20000 = 5) go to pool
      expect(await stack.fusdToken.balanceOf(stack.rewardSystem.address)).to.equal(expandTo18Decimals(5))

      // Proceedings after fees: 500 / 20000 * (1 - 0.01) = 0.02475 BTC
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(500))
      expect(await stack.lbtcToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(0.02475))
    })

    it("fee not splitted when split ratio is not set", async () => {
      // Set fee holder to bob
      await stack.exchangeSystem.connect(admin).setFoundationFeeHolder(
        bob.address // _foundationFeeHolder
      )

      // Alice exchanges 500 FUSD for 0.025 lBTC
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )
      await settleTradeWithDelay(1)

      // All fees (0.025 * 0.01 * 20000 = 5) go to pool
      expect(await stack.fusdToken.balanceOf(stack.rewardSystem.address)).to.equal(expandTo18Decimals(5))
      expect(await stack.fusdToken.balanceOf(bob.address)).to.equal(0)

      // Proceedings after fees: 500 / 20000 * (1 - 0.01) = 0.02475 BTC
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(500))
      expect(await stack.lbtcToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(0.02475))
    })

    it("fee splitted to pool and foundation", async () => {
      // Set fee split ratio to 30%
      await stack.config.connect(admin).setUint(
        ethers.utils.formatBytes32String("FoundationFeeSplit"), // key
        expandTo18Decimals(0.3) // value
      )

      // Set fee holder to bob
      await stack.exchangeSystem.connect(admin).setFoundationFeeHolder(
        bob.address // _foundationFeeHolder
      )

      // Alice exchanges 500 FUSD for 0.025 lBTC
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )
      await passSettlementDelay()
      await expect(settleTrade(1)).to.emit(stack.exchangeSystem, "PendingExchangeSettled").withArgs(
        1, // id
        settler.address, // settler
        expandTo18Decimals(0.02475), // destRecived
        expandTo18Decimals(0.025), // destAmount
        expandTo18Decimals(3.5), // feeForPool
        expandTo18Decimals(1.5), // feeForFoundation
        expandTo18Decimals(1), // fromCurrencyPrice
        expandTo18Decimals(20000) // toCurrencyPrice
      )

      /**
       * Fee split:
       *   Total = 0.025 * 0.01 * 20000 = 5 FUSD
       *   Foundation = 5 * 0.3 = 1.5 FUSD
       *   Pool = 5 - 1.5 = 3.5 FUSD
       */
      expect(await stack.fusdToken.balanceOf(stack.rewardSystem.address)).to.equal(expandTo18Decimals(3.5))
      expect(await stack.fusdToken.balanceOf(bob.address)).to.equal(expandTo18Decimals(1.5))

      // Proceedings after fees: 500 / 20000 * (1 - 0.01) = 0.02475 BTC
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(500))
      expect(await stack.lbtcToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(0.02475))
    })

    it("cannot settle when price is staled", async () => {
      const exchangeAction = () =>
        stack.exchangeSystem.connect(alice).exchange(
          ethers.utils.formatBytes32String("FUSD"), // sourceKey
          expandTo18Decimals(500), // sourceAmount
          alice.address, // destAddr
          ethers.utils.formatBytes32String("lBTC") // destKey
        )

      // Temporarily set delay to avoid settlement issue
      await stack.config.connect(admin).setUint(
        ethers.utils.formatBytes32String("TradeRevertDelay"), // key
        Duration.fromObject({ days: 10 }).as("seconds")
      )

      // Make 2 exchanges
      await exchangeAction()
      await exchangeAction()

      // Can settle when price is not staled
      await setNextBlockTimestamp(ethers.provider, priceUpdateTime.plus(stalePeriod))
      await settleTrade(1)

      // Cannot settle once price becomes staled
      await setNextBlockTimestamp(ethers.provider, priceUpdateTime.plus(stalePeriod).plus({ seconds: 1 }))
      await expect(settleTrade(2)).to.be.revertedWith("MockPrices: staled price data")
    })

    it("can sell when position entrance is disabled", async () => {
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )
      await settleTradeWithDelay(1)

      await stack.exchangeSystem.connect(admin).setExitPositionOnly(true)

      await stack.lbtcToken.connect(alice).approve(stack.exchangeSystem.address, uint256Max)

      // Can still sell
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("lBTC"), // sourceKey
        expandTo18Decimals(0.01), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("FUSD") // destKey
      )
    })

    it("cannot buy when position entrance is disabled", async () => {
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )

      await stack.exchangeSystem.connect(admin).setExitPositionOnly(true)

      // Can no longer buy
      await expect(
        stack.exchangeSystem.connect(alice).exchange(
          ethers.utils.formatBytes32String("FUSD"), // sourceKey
          expandTo18Decimals(500), // sourceAmount
          alice.address, // destAddr
          ethers.utils.formatBytes32String("lBTC") // destKey
        )
      ).to.be.revertedWith("ExchangeSystem: can only exit position")
    })

    it("events should be emitted for exchange and settlement", async () => {
      await expect(
        stack.exchangeSystem.connect(alice).exchange(
          ethers.utils.formatBytes32String("FUSD"), // sourceKey
          expandTo18Decimals(500), // sourceAmount
          alice.address, // destAddr
          ethers.utils.formatBytes32String("lBTC") // destKey
        )
      )
        .to.emit(stack.exchangeSystem, "PendingExchangeAdded")
        .withArgs(
          1, // id
          alice.address, // fromAddr
          alice.address, // destAddr
          expandTo18Decimals(500), // fromAmount
          ethers.utils.formatBytes32String("FUSD"), // fromCurrency
          ethers.utils.formatBytes32String("lBTC"), // toCurrency
          expandTo18Decimals(0.025)
        )

      /**
       * lBTC price changes to 40,000. Will only receive:
       *     500 / 40000 * 0.99 = 0.012375 lBTC
       */
      await passSettlementDelay()
      await setLbtcPrice(40_000)

      await expect(settleTrade(1))
        .to.be.emit(stack.exchangeSystem, "PendingExchangeReverted")
        .withArgs(1)
        .and.emit(stack.fusdToken, "Transfer")
        .withArgs(
          stack.exchangeSystem.address, // from
          alice.address, // to
          expandTo18Decimals(500) // value
        )

      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(1_000))
      expect(await stack.fusdToken.balanceOf(stack.exchangeSystem.address)).to.equal(0)
    })

    it("events should be emitted for exchange and settlement", async () => {
      await expect(
        stack.exchangeSystem.connect(alice).exchange(
          ethers.utils.formatBytes32String("FUSD"), // sourceKey
          expandTo18Decimals(500), // sourceAmount
          alice.address, // destAddr
          ethers.utils.formatBytes32String("lBTC") // destKey
        )
      )
        .to.emit(stack.exchangeSystem, "PendingExchangeAdded")
        .withArgs(
          1, // id
          alice.address, // fromAddr
          alice.address, // destAddr
          expandTo18Decimals(500), // fromAmount
          ethers.utils.formatBytes32String("FUSD"), // fromCurrency
          ethers.utils.formatBytes32String("lBTC"), // toCurrency
          expandTo18Decimals(0.025)
        )

      await stack.config
        .connect(admin)
        .setUint(ethers.utils.formatBytes32String("DeviationExchange"), expandTo18Decimals(1))
      /**
       * lBTC price changes to 40,000. Will only receive:
       *     500 / 40000 * 0.99 = 0.012375 lBTC
       */
      await passSettlementDelay()
      await setLbtcPrice(40_000)

      await expect(settleTrade(1)).to.emit(stack.exchangeSystem, "PendingExchangeSettled").withArgs(
        1, // id
        settler.address, // settler
        expandTo18Decimals(0.012375), // destRecived
        expandTo18Decimals(0.0125), // destAmount
        expandTo18Decimals(5), // feeForPool
        0, // feeForFoundation
        expandTo18Decimals(1), // fromCurrencyPrice
        expandTo18Decimals(40000) // toCurrencyPrice
      )
    })

    it("cannot settle trade before delay is passed", async () => {
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )

      // Cannot settle before delay is reached
      await setNextBlockTimestamp(
        ethers.provider,
        (await getBlockDateTime(ethers.provider)).plus(settlementDelay).minus({ seconds: 1 })
      )
      await expect(settleTrade(1)).to.be.revertedWith("ExchangeSystem: settlement delay not passed")

      // Can settle once delay is reached
      await setNextBlockTimestamp(ethers.provider, (await getBlockDateTime(ethers.provider)).plus(settlementDelay))
      await settleTrade(1)
    })

    it("source asset should be locked up on exchange", async () => {
      await expect(
        stack.exchangeSystem.connect(alice).exchange(
          ethers.utils.formatBytes32String("FUSD"), // sourceKey
          expandTo18Decimals(400), // sourceAmount
          alice.address, // destAddr
          ethers.utils.formatBytes32String("lBTC") // destKey
        )
      )
        .to.emit(stack.fusdToken, "Transfer")
        .withArgs(
          alice.address, // from
          stack.exchangeSystem.address, // to
          expandTo18Decimals(400) // value
        )

      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(600))
      expect(await stack.fusdToken.balanceOf(stack.exchangeSystem.address)).to.equal(expandTo18Decimals(400))
    })

    it("trade cannot be settled twice", async () => {
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )

      // Trade settled
      await settleTradeWithDelay(1)

      // Cannot double-settle a trade
      await expect(settleTrade(1)).to.be.revertedWith("ExchangeSystem: pending entry not found")
    })

    it("can only rollback trade after rollback delay", async () => {
      console.log("xxxxx-1")
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )

      const exchangeTime = await getBlockDateTime(ethers.provider)
      console.log("xxxxx-2")

      await setNextBlockTimestamp(ethers.provider, exchangeTime.plus(revertDelay))
      await expect(
        stack.exchangeSystem.connect(settler).rollback(
          1 // pendingExchangeEntryId
        )
      ).to.be.revertedWith("ExchangeSystem: revert delay not passed")
      console.log("xxxxx-3")

      await setNextBlockTimestamp(ethers.provider, exchangeTime.plus(revertDelay).plus({ seconds: 1 }))
      await expect(
        stack.exchangeSystem.connect(settler).rollback(
          1 // pendingExchangeEntryId
        )
      )
        .to.emit(stack.exchangeSystem, "PendingExchangeReverted")
        .withArgs(
          1 // id
        )
        .and.emit(stack.fusdToken, "Transfer")
        .withArgs(
          stack.exchangeSystem.address, // from
          alice.address, // to
          expandTo18Decimals(500) // value
        )
      console.log("xxxxx-4")

      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(1_000))
      expect(await stack.fusdToken.balanceOf(stack.exchangeSystem.address)).to.equal(0)
    })

    it("cannot settle trade after rollback delay", async () => {
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )

      const exchangeTime = await getBlockDateTime(ethers.provider)

      await setNextBlockTimestamp(ethers.provider, exchangeTime.plus(revertDelay).plus({ seconds: 1 }))
      await expect(settleTrade(1)).to.be.revertedWith("ExchangeSystem: trade can only be reverted now")
    })

    it("cannot rollback trade twice", async () => {
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("lBTC") // destKey
      )

      const exchangeTime = await getBlockDateTime(ethers.provider)

      await setNextBlockTimestamp(ethers.provider, exchangeTime.plus(revertDelay).plus({ seconds: 1 }))
      await stack.exchangeSystem.connect(settler).rollback(
        1 // pendingExchangeEntryId
      )

      // Cannot rollback again
      await expect(
        stack.exchangeSystem.connect(settler).rollback(
          1 // pendingExchangeEntryId
        )
      ).to.be.revertedWith("ExchangeSystem: pending entry not found")
    })

    it("cannot rollback not exist trade ", async () => {
      // Cannot rollback again
      await expect(
        stack.exchangeSystem.connect(settler).rollback(
          10000 // pendingExchangeEntryId
        )
      ).to.be.revertedWith("ExchangeSystem: pending entry not found")
    })

    it("stake and build non-fusd synthetic assets", async () => {
      console.log("Set BTC price to $100")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("lBTC"), // currencyKey
        expandTo18Decimals(100) // price
      )
      console.log("Set BTC price to $100")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BTC"), // currencyKey
        expandTo18Decimals(100) // price
      )

      // Mint 1,000,000 BTC to Alice
      await stack.btcToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
      await stack.btcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

      const balance1 = await stack.lbtcToken.balanceOf(alice.address)
      console.log("balance before mint: ", ethers.utils.formatEther(balance1))
      expect(balance1).to.eq(ethers.utils.parseEther("0"))
      // Alice can stake BTC and build lBTC
      await stack.collateralSystem.connect(alice).stakeAndBuildNonFUSD(
        ethers.utils.formatBytes32String("BTC"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        ethers.utils.formatBytes32String("lBTC"), // buildCurrency
        expandTo18Decimals(2000), // buildAmount
        0
      )

      await settleTradeWithDelay(1)
      const balance2 = await stack.lbtcToken.balanceOf(alice.address)
      console.log("balance after mint: ", ethers.utils.formatEther(balance2))
      // balance: 100*10000*0.2 * (1-0.01), need to sub the exchange fee
      expect(balance2).to.eq(ethers.utils.parseEther("1980"))
      const rewardBalance = await stack.platformToken.balanceOf(alice.address)
      console.log("exchange reward: ", ethers.utils.formatEther(rewardBalance))
      expect(rewardBalance).to.be.gt(0)
    })

    it("stake and build non-fusd synthetics with locked platform token", async () => {
      console.log("Set BTC price to $100")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("lBTC"), // currencyKey
        expandTo18Decimals(100) // price
      )
      console.log("Set BTC price to $100")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BTC"), // currencyKey
        expandTo18Decimals(100) // price
      )

      console.log("Set BST price to $0.1")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.1) // price
      )

      // Mint 1,000,000 BTC to Alice
      await stack.btcToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
      await stack.btcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

      await stack.platformToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

      // add stake pool for locked platform token
      await stack.minerReward.addPool(1, stack.platformToken.address, stack.linearRelease.address, 0)
      // set the exchange reward config info
      await stack.minerReward
        .connect(admin)
        .setExchangeRewardInfo(0, expandTo18Decimals(0.01), expandTo18Decimals(10000))
      // transform ownership to exchangeReward to mint reward

      const balance1 = await stack.lbtcToken.balanceOf(alice.address)
      console.log("balance before mint: ", ethers.utils.formatEther(balance1))
      expect(balance1).to.eq(ethers.utils.parseEther("0"))

      const maxCanBuild = await stack.collateralSystem.getMaxBuildAmount(
        alice.address,
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(100),
        ethers.utils.formatBytes32String("lBTC"),
        expandTo18Decimals(10000)
      )
      console.log("ExpectMaxCanBuild: ", ethers.utils.formatEther(maxCanBuild))
      // Alice can stake BTC and build lBTC
      await stack.collateralSystem.connect(alice).stakeAndBuildNonFUSD(
        ethers.utils.formatBytes32String("BTC"), // stakeCurrency
        expandTo18Decimals(100), // stakeAmount
        ethers.utils.formatBytes32String("lBTC"), // buildCurrency
        maxCanBuild, // buildAmount
        expandTo18Decimals(10000) // lockedAmount
      )

      await settleTradeWithDelay(1)
      const balance2 = await stack.lbtcToken.balanceOf(alice.address)
      console.log("lbtc balance after mint: ", ethers.utils.formatEther(balance2))
      // without catalyst balance: 100*0.2 *(1-0.01)
      expect(balance2).to.be.gt(ethers.utils.parseEther("19.80"))
    })

    it("should burn non-fusd synthetics and unstake", async () => {
      // transform ownership to exchangeReward to mint reward
      console.log("Set BTC price to $100")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("lBTC"), // currencyKey
        expandTo18Decimals(100) // price
      )
      console.log("Set BTC price to $100")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BTC"), // currencyKey
        expandTo18Decimals(100) // price
      )

      // Mint 10,000,TC to Alice
      await stack.btcToken.connect(admin).mint(alice.address, expandTo18Decimals(10_000))
      await stack.btcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

      const balance1 = await stack.lbtcToken.balanceOf(alice.address)
      console.log("balance before mint: ", ethers.utils.formatEther(balance1))
      expect(balance1).to.eq(ethers.utils.parseEther("0"))
      // Alice can stake BTC and build lBTC
      await stack.collateralSystem.connect(alice).stakeAndBuildNonFUSD(
        ethers.utils.formatBytes32String("BTC"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        ethers.utils.formatBytes32String("lBTC"), // buildCurrency
        expandTo18Decimals(2000), // buildAmount
        0
      )

      await expect(settleTradeWithDelay(1))

      await stack.lbtcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

      // Alice now got 1980 lbtc and can burn them all
      await stack.collateralSystem.connect(alice).burnNonFUSDAndUnstake(
        ethers.utils.formatBytes32String("lBTC"), // burnCurrency
        expandTo18Decimals(1980), // burnAmount
        ethers.utils.formatBytes32String("BTC"), // unstakeCurrency
        expandTo18Decimals(9801) // unstakeAmount. 1980*100*(1-0.01)*5/100 = 9801
      )
      // await settleTradeWithDelay(2)
      await passSettlementDelay()
      await expect(settleTrade(2))
        // .to.emit(stack.exchangeSystem, "PendingMintOrBurnSettled")
        // .to.emit(stack.exchangeSystem, "PendingExchangeSettled")
        .to.emit(stack.debtSystem, "UpdateUserDebtLog")
        .to.emit(stack.collateralSystem, "Burn")

      const balance2 = await stack.lbtcToken.balanceOf(alice.address)
      console.log("lbtc balance after burn: ", ethers.utils.formatEther(balance2))
      expect(balance2).to.eq(ethers.utils.parseEther("0"))
      console.log("btc balance after burn: ", ethers.utils.formatEther(await stack.btcToken.balanceOf(alice.address)))
      expect(await stack.btcToken.balanceOf(alice.address)).to.be.eq(expandTo18Decimals(9801))
    })

    it("burn non-fusd synthetics and unstake locked platform token", async () => {
      console.log("ExchangeSystem address: ", stack.exchangeSystem.address)
      console.log("CollateralSystem address: ", stack.collateralSystem.address)
      console.log("alice address: ", alice.address)

      console.log("Set BTC price to $100")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("lBTC"), // currencyKey
        expandTo18Decimals(100) // price
      )
      console.log("Set BTC price to $100")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BTC"), // currencyKey
        expandTo18Decimals(100) // price
      )

      console.log("Set BST price to $0.1")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.1) // price
      )

      // Mint 1,000,000 USDC to Alice
      await stack.usdcToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
      await stack.usdcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

      // Mint 1,000,000 BTC to Alice
      await stack.btcToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
      await stack.btcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

      // Mint 1,000,000 BST to Alice
      // await stack.platformToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
      await stack.platformToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

      // add stake pool for locked platform token
      await stack.minerReward.addPool(1, stack.platformToken.address, stack.linearRelease.address, 0)
      // transform ownership to exchangeReward to mint reward

      const balance1 = await stack.lbtcToken.balanceOf(alice.address)
      console.log("balance before mint: ", ethers.utils.formatEther(balance1))
      expect(balance1).to.eq(ethers.utils.parseEther("0"))
      // Alice can stake BTC and build lBTC
      await stack.collateralSystem.connect(alice).stakeAndBuildNonFUSD(
        ethers.utils.formatBytes32String("BTC"), // stakeCurrency
        expandTo18Decimals(100), // stakeAmount
        ethers.utils.formatBytes32String("lBTC"), // buildCurrency
        expandTo18Decimals(20), // buildAmount
        expandTo18Decimals(10000) // lockedAmount
      )

      await settleTradeWithDelay(1)
      await stack.lbtcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)
      // Alice now got about 20.82 lbtc and can burn them all

      // Mint a little more lbtc to Alice to burn max and get locked platform token back
      // Alice can stake USDC and build lBTC
      await stack.collateralSystem.connect(alice).stakeAndBuildNonFUSD(
        ethers.utils.formatBytes32String("USDC"), // stakeCurrency
        expandTo18Decimals(5000), // stakeAmount
        ethers.utils.formatBytes32String("lBTC"), // buildCurrency
        expandTo18Decimals(10), // buildAmount
        0 // lockedAmount
      )
      await settleTradeWithDelay(2)

      await stack.collateralSystem.connect(alice).burnNonFUSDAndUnstake(
        ethers.utils.formatBytes32String("lBTC"), // burnCurrency
        expandTo18Decimals(25), // burnAmount
        ethers.utils.formatBytes32String("BTC"), // unstakeCurrency
        expandTo18Decimals(100) // unstakeAmount.
      )
      await settleTradeWithDelay(3)

      console.log("btc balance after burn: ", ethers.utils.formatEther(await stack.btcToken.balanceOf(alice.address)))
      expect(await stack.btcToken.balanceOf(alice.address)).to.be.eq(expandTo18Decimals(1_000_000))
      console.log(
        "platform token balance after burn: ",
        ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address))
      )
      expect(await stack.platformToken.balanceOf(alice.address)).to.be.gt(expandTo18Decimals(1_000_000)) // some reward added
    })
  })
})
