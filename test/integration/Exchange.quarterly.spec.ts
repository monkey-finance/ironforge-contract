import { DateTime, Duration } from "luxon"
import { ethers } from "hardhat"
import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { expandTo18Decimals, uint256Max } from "../utilities"
import { getBlockDateTime, setNextBlockTimestamp } from "../utilities/timeTravel"
import { deployWithMockPrice } from "../../scripts/testnet/localhost/deployWithMockPrice"
import { DeployedStackResult } from "../../scripts/testnet/deployParamTypes"
import { AssetUpgradeable } from "../../typechain"
const LBTC202112 = "lBTCUSD_211231"

describe("Integration | Exchange quarterly contract", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    settler: SignerWithAddress

  let stack: DeployedStackResult
  let lbtcToken202112: AssetUpgradeable
  const settlementDelay: Duration = Duration.fromObject({ minutes: 1 })
  const revertDelay: Duration = Duration.fromObject({ minutes: 10 })
  const stalePeriod: Duration = Duration.fromObject({ hours: 12 })
  let priceUpdateTime: DateTime

  const setLbtcPrice = async (price: number): Promise<void> => {
    await stack.prices.connect(admin).setPrice(
      ethers.utils.formatBytes32String(LBTC202112), // currencyKey
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
    lbtcToken202112 = <AssetUpgradeable>stack.lbtcToken202112
    priceUpdateTime = await getBlockDateTime(ethers.provider)

    // Set BTC price to $0.01 and lBTC to $20,000
    await stack.prices.connect(admin).setPriceAndTime(
      ethers.utils.formatBytes32String("BTC"), // currencyKey
      expandTo18Decimals(0.01), // price
      priceUpdateTime.toSeconds() // updateTime
    )

    await stack.prices.connect(admin).setPriceAndTime(
      ethers.utils.formatBytes32String(LBTC202112), // currencyKey
      expandTo18Decimals(20_000), // price
      priceUpdateTime.toSeconds() // updateTime
    )

    // Set BTC exchange fee rate to 1%
    await stack.config.connect(admin).setUint(
      ethers.utils.formatBytes32String(LBTC202112), // key
      expandTo18Decimals(0.01) // value
    )

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

    // Mint 1,000,000 BTC to Alice
    await stack.btcToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))

    // Alice stakes all BTC
    await stack.btcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)
    await stack.collateralSystem
      .connect(alice)
      .stakeAndBuild(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(1_000_000),
        expandTo18Decimals(1_000),
        0
      )

    await stack.prices.connect(admin).setStalePeriod(stalePeriod.as("seconds"))
    await stack.platformToken.connect(admin).transferOwnership(stack.minerReward.address)
    await stack.fusdToken.connect(alice).approve(stack.exchangeSystem.address, uint256Max)
    await lbtcToken202112.connect(alice).approve(stack.exchangeSystem.address, uint256Max)
  })
  context("context no name", async () => {
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
        ethers.utils.formatBytes32String(LBTC202112) // destKey
      )
      await settleTradeWithDelay(1)

      // All fees (0.025 * 0.01 * 20000 = 5) go to pool
      expect(await stack.fusdToken.balanceOf(stack.rewardSystem.address)).to.equal(expandTo18Decimals(5))

      // Proceedings after fees: 500 / 20000 * (1 - 0.01) = 0.02475 BTC
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(500))
      expect(await lbtcToken202112.balanceOf(alice.address)).to.equal(expandTo18Decimals(0.02475))
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
        ethers.utils.formatBytes32String(LBTC202112) // destKey
      )
      await settleTradeWithDelay(1)

      // All fees (0.025 * 0.01 * 20000 = 5) go to pool
      expect(await stack.fusdToken.balanceOf(stack.rewardSystem.address)).to.equal(expandTo18Decimals(5))
      expect(await stack.fusdToken.balanceOf(bob.address)).to.equal(0)

      // Proceedings after fees: 500 / 20000 * (1 - 0.01) = 0.02475 BTC
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(500))
      expect(await lbtcToken202112.balanceOf(alice.address)).to.equal(expandTo18Decimals(0.02475))
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
        ethers.utils.formatBytes32String(LBTC202112) // destKey
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
      expect(await lbtcToken202112.balanceOf(alice.address)).to.equal(expandTo18Decimals(0.02475))
    })

    it("cannot settle when price is staled", async () => {
      const exchangeAction = () =>
        stack.exchangeSystem.connect(alice).exchange(
          ethers.utils.formatBytes32String("FUSD"), // sourceKey
          expandTo18Decimals(500), // sourceAmount
          alice.address, // destAddr
          ethers.utils.formatBytes32String(LBTC202112) // destKey
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
        ethers.utils.formatBytes32String(LBTC202112) // destKey
      )
      await settleTradeWithDelay(1)

      await stack.exchangeSystem.connect(admin).setExitPositionOnly(true)

      // Can still sell
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String(LBTC202112), // sourceKey
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
        ethers.utils.formatBytes32String(LBTC202112) // destKey
      )

      await stack.exchangeSystem.connect(admin).setExitPositionOnly(true)

      // Can no longer buy
      await expect(
        stack.exchangeSystem.connect(alice).exchange(
          ethers.utils.formatBytes32String("FUSD"), // sourceKey
          expandTo18Decimals(500), // sourceAmount
          alice.address, // destAddr
          ethers.utils.formatBytes32String(LBTC202112) // destKey
        )
      ).to.be.revertedWith("ExchangeSystem: can only exit position")
    })

    it("events should be emitted for exchange and settlement", async () => {
      await expect(
        stack.exchangeSystem.connect(alice).exchange(
          ethers.utils.formatBytes32String("FUSD"), // sourceKey
          expandTo18Decimals(500), // sourceAmount
          alice.address, // destAddr
          ethers.utils.formatBytes32String(LBTC202112) // destKey
        )
      )
        .to.emit(stack.exchangeSystem, "PendingExchangeAdded")
        .withArgs(
          1, // id
          alice.address, // fromAddr
          alice.address, // destAddr
          expandTo18Decimals(500), // fromAmount
          ethers.utils.formatBytes32String("FUSD"), // fromCurrency
          ethers.utils.formatBytes32String(LBTC202112), // toCurrency
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
        ethers.utils.formatBytes32String(LBTC202112) // destKey
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
          ethers.utils.formatBytes32String(LBTC202112) // destKey
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
        ethers.utils.formatBytes32String(LBTC202112) // destKey
      )

      // Trade settled
      await settleTradeWithDelay(1)

      // Cannot double-settle a trade
      await expect(settleTrade(1)).to.be.revertedWith("ExchangeSystem: pending entry not found")
    })

    it("can only rollback trade after rollback delay", async () => {
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String(LBTC202112) // destKey
      )

      const exchangeTime = await getBlockDateTime(ethers.provider)

      await setNextBlockTimestamp(ethers.provider, exchangeTime.plus(revertDelay))
      await expect(
        stack.exchangeSystem.connect(settler).rollback(
          1 // pendingExchangeEntryId
        )
      ).to.be.revertedWith("ExchangeSystem: revert delay not passed")

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

      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(1_000))
      expect(await stack.fusdToken.balanceOf(stack.exchangeSystem.address)).to.equal(0)
    })

    it("cannot settle trade after rollback delay", async () => {
      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String(LBTC202112) // destKey
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
        ethers.utils.formatBytes32String(LBTC202112) // destKey
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

    it("should can exchange if price is frozen", async () => {
      // set quarterly contract frozen
      await stack.prices.connect(admin).setFrozen(
        ethers.utils.formatBytes32String(LBTC202112), // currencyKey
        true
      )

      await stack.exchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("FUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String(LBTC202112) // destKey
      )
      await passSettlementDelay()
      await stack.exchangeSystem.connect(settler).settle(
        1 // pendingExchangeEntryId
      )
    })

    it("should not exchanges when asset is forbidden", async () => {
      await stack.assetSystem.setForbidAsset(ethers.utils.formatBytes32String("lBTC"), true)
      await expect(
        stack.exchangeSystem
          .connect(alice)
          .exchange(
            ethers.utils.formatBytes32String("FUSD"),
            1,
            alice.address,
            ethers.utils.formatBytes32String("lBTC")
          )
      ).to.be.revertedWith("ExchangeSystem: dest is forbid")
    })
  })
})
