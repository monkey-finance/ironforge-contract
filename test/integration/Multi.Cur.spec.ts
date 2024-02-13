import { ethers, tracer } from "hardhat"
import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { expandTo18Decimals } from "../utilities"
import { getBlockDateTime, setNextBlockTimestamp } from "../utilities/timeTravel"
import { Duration } from "luxon"
import { deployWithMockPrice } from "../../scripts/testnet/localhost/deployWithMockPrice"
import { DeployedStackResult } from "../../scripts/testnet/deployParamTypes"

describe("Integration | Multi Currency: Stake/Build， Burn/Unstake，Liquidate", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    yin: SignerWithAddress

  let stack: DeployedStackResult
  const liquidationDelay: Duration = Duration.fromObject({ days: 3 })

  const BST = "BST"
  const BTC = "BTC"
  const passLiquidationDelay = async (): Promise<void> => {
    await setNextBlockTimestamp(
      ethers.provider,
      (await getBlockDateTime(ethers.provider)).plus(liquidationDelay).plus({ seconds: 1 })
    )
  }
  beforeEach(async function () {
    ;[deployer, alice, bob, yin] = await ethers.getSigners()
    admin = deployer
    this.timeout(30000)

    console.log(`deployer: ${deployer.address}, alice: ${alice.address}`)
    console.log(`bob: ${bob.address}, yin: ${yin.address}`)

    tracer.nameTags[deployer.address] = "deployerAddress"
    tracer.nameTags[alice.address] = "aliceAddress"
    tracer.nameTags[bob.address] = "bobAddress"
    tracer.nameTags[yin.address] = "yinAddress"

    stack = await deployWithMockPrice(deployer, admin)

    async function setup(user: SignerWithAddress, currencyKey: string, price: number, amount: number) {
      console.log("setup")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String(currencyKey), // currencyKey
        expandTo18Decimals(price) // price
      )
      if (currencyKey == BST) {
        await stack.platformToken.connect(admin).mint(
          user.address, // account
          expandTo18Decimals(amount) // amounts
        )
        await stack.platformToken.connect(user).approve(
          stack.collateralSystem.address, // spender
          expandTo18Decimals(amount) // amount
        )
        const balance = await stack.platformToken.connect(user).balanceOf(user.address)
        console.log(`BST balance is ${balance}`)
      } else if (currencyKey == BTC) {
        await stack.btcToken.connect(admin).mint(
          user.address, // account
          expandTo18Decimals(amount) // amounts
        )
        await stack.btcToken.connect(user).approve(
          stack.collateralSystem.address, // spender
          expandTo18Decimals(amount) // amount
        )
        const balance = await stack.btcToken.connect(user).balanceOf(user.address)
        console.log(`BTC balance is ${balance}`)
      }
    }

    await setup(alice, BST, 0.01, 10_000)
    await setup(bob, BTC, 1000, 1)
  })
  context("context no name", async () => {
    it("can burn and unstake max atomically，BTC，BST => liq", async function () {
      // Alice stakes 10,000 BST and builds 20 FUSD
      console.log("test: Alice stakes 10,000 BST and builds 20 FUSD")
      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String(BST), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        expandTo18Decimals(20), // stakeAmount
        0
      )

      // 测试Alice是否持有FUSD
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(20))
      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(0))

      console.log("test: Alice burnAndUnstakeMax 5 BST")
      await expect(
        stack.collateralSystem.connect(alice).burnAndUnstakeMax(
          expandTo18Decimals(5), // Amount of FUSD to burn
          ethers.utils.formatBytes32String(BST) // unStakeCurrency
        )
      )
        .to.emit(stack.debtSystem, "PushDebtLog")
        .and.emit(stack.collateralSystem, "RedeemCollateral")

      // 测试alice的BST是否变多
      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(2500))
      console.log("test: Alice getUserCollateral")

      expect(
        await stack.collateralSystem.getUserCollateral(
          alice.address, // _user
          ethers.utils.formatBytes32String(BST) // _currency
        )
      ).to.equal(expandTo18Decimals(7500))

      console.log("test: Alice GetUserDebtBalanceInUsd")

      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String(BST) // unStakeCurrency
          )
        )[0]
      ).to.equal(expandTo18Decimals(15))

      console.log("test: bob stakes 1 BTC and builds 200 FUSD")

      /**
       * alice done, add bob with btc
       */

      await stack.collateralSystem.connect(bob).stakeAndBuild(
        ethers.utils.formatBytes32String(BTC), // stakeCurrency
        expandTo18Decimals(1), // stakeAmount
        expandTo18Decimals(200),
        0
      )
      // 测试 bob 是否持有 FUSD
      expect(await stack.fusdToken.balanceOf(bob.address)).to.equal(expandTo18Decimals(200))
      expect(await stack.btcToken.balanceOf(bob.address)).to.equal(expandTo18Decimals(0))

      console.log("test: bob burnAndUnstakeMax 100u")

      await stack.collateralSystem.connect(bob).burnAndUnstakeMax(
        expandTo18Decimals(100), // burnAmount
        ethers.utils.formatBytes32String(BTC) // unStakeCurrency
      )

      // 测试 bob 是否拿到了btc
      expect(await stack.btcToken.balanceOf(bob.address)).to.equal(expandTo18Decimals(0.5))

      console.log("test: bob getUserCollateral")

      expect(
        await stack.collateralSystem.getUserCollateral(
          bob.address, // _user
          ethers.utils.formatBytes32String(BTC) // _currency
        )
      ).to.equal(expandTo18Decimals(0.5))

      console.log("test: bob GetUserDebtBalanceInUsd")

      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            bob.address, // _user
            ethers.utils.formatBytes32String(BTC) // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(100))

      /**
       * change price to liq alice
       */

      console.log(
        "test: 10000 BST 100，20u -> unstak 5u<7500BST,15u> -> BST <price:0.01,c:75,max:15> to <0.004,30,6> -> current ratio is 200%"
      )

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String(BST), // currencyKey
        expandTo18Decimals(0.004) // price
      )

      console.log("test: Can't mark Alice's position as it's not *below* liquidation ratio")
      await expect(
        stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BST))
      ).to.be.revertedWith("Liquidation: not underCollateralized")

      console.log("test: Price of BTC drops such that Alice's C-ratio falls below liquidation ratio")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String(BST), // currencyKey
        expandTo18Decimals(0.0038) // price
      )

      console.log(
        "test: Price of BTC drops such that Alice's C-ratio falls below liquidation ratio, Can mark position normally"
      )
      // Can mark position normally
      await expect(stack.liquidation.connect(yin).markPosition(alice.address, ethers.utils.formatBytes32String(BST)))
        .to.emit(stack.liquidation, "PositionMarked")
        .withArgs(
          alice.address, // user
          yin.address // marker
        )

      expect(await stack.liquidation.isPositionMarked(alice.address)).to.equal(true)
      expect(await stack.liquidation.getMarker(alice.address)).to.equal(yin.address)
      await passLiquidationDelay()

      console.log(
        "test: Price of BTC drops such that Alice's C-ratio falls below liquidation ratio, liquidatePositionMax"
      )
      console.log(
        "test: 10000 BST 100，20u -> unstak 5u<7500BST,15u> -> BST <price:0.01,c:75,max:15> -> BST <0.004,30,6> -> <0.0038,28.5,5.7>"
      )

      await expect(
        stack.liquidation.connect(yin).liquidatePositionMax(alice.address, ethers.utils.formatBytes32String(BST))
      ).to.emit(stack.liquidation, "PositionLiquidated")
      /**
       * change price to liq bob
       */
      console.log(
        "test: 1 btc 1000，200u -> unstak 100u<0.5,100u> -> btc <price:1000,c:500,max:100> to <400,200,40> -> current ratio is 200%"
      )

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("btc"), // currencyKey
        expandTo18Decimals(400) // price
      )

      console.log("test: Can't mark Bob's position as it's not *below* liquidation ratio")
      await expect(
        stack.liquidation.connect(yin).markPosition(bob.address, ethers.utils.formatBytes32String(BTC))
      ).to.be.revertedWith("Liquidation: not underCollateralized")

      console.log("test: Price of BTC drops such that Bob's C-ratio falls below liquidation ratio")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String(BTC), // currencyKey
        expandTo18Decimals(380) // price
      )
      console.log(
        "test: Price of BTC drops such that Bob's C-ratio falls below liquidation ratio, Can mark position normally"
      )
      // Can mark position normally
      await expect(stack.liquidation.connect(yin).markPosition(bob.address, ethers.utils.formatBytes32String(BTC)))
        .to.emit(stack.liquidation, "PositionMarked")
        .withArgs(
          bob.address, // user
          yin.address // marker
        )

      expect(await stack.liquidation.isPositionMarked(bob.address)).to.equal(true)
      expect(await stack.liquidation.getMarker(bob.address)).to.equal(yin.address)

      await passLiquidationDelay()

      console.log(
        "test: Price of BTC drops such that Bob's C-ratio falls below liquidation ratio, liquidatePositionMax"
      )
      await expect(
        stack.liquidation.connect(yin).liquidatePositionMax(bob.address, ethers.utils.formatBytes32String(BTC))
      ).to.emit(stack.liquidation, "PositionLiquidated")
    })

    it("can burn and unstake max atomically => liq，BST", async function () {
      // Alice stakes 10,000 BST and builds 20 FUSD
      console.log("test: Alice stakes 10,000 BST and builds 20 FUSD")
      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String(BST), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        expandTo18Decimals(20),
        0
      )

      // 测试Alice是否持有FUSD
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(20))
      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(0))

      console.log("test: Alice burnAndUnstakeMax 5 BST")
      await expect(
        stack.collateralSystem.connect(alice).burnAndUnstakeMax(
          expandTo18Decimals(5), // Amount of FUSD to burn
          ethers.utils.formatBytes32String(BST) // unStakeCurrency
        )
      )
        .to.emit(stack.debtSystem, "PushDebtLog")
        .and.emit(stack.collateralSystem, "RedeemCollateral")

      // 测试alice的BST是否变多
      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(2500))
      console.log("test: Alice getUserCollateral")

      expect(
        await stack.collateralSystem.getUserCollateral(
          alice.address, // _user
          ethers.utils.formatBytes32String(BST) // _currency
        )
      ).to.equal(expandTo18Decimals(7500))

      console.log("test: Alice GetUserDebtBalanceInUsd")

      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String(BST) // unStakeCurrency
          )
        )[0]
      ).to.equal(expandTo18Decimals(15))

      console.log("test: bob stakes 1 BTC and builds 200 FUSD")

      /**
       * change price to liq alice
       */

      console.log(
        "test: 10000 BST 100，20u -> unstak 5u<7500BST,15u> -> BST <price:0.01,c:75,max:15> to <0.004,30,6> -> current ratio is 200%"
      )

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String(BST), // currencyKey
        expandTo18Decimals(0.004) // price
      )

      console.log("test: Can't mark Alice's position as it's not *below* liquidation ratio")
      await expect(
        stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BST))
      ).to.be.revertedWith("Liquidation: not underCollateralized")

      console.log("test: Price of BTC drops such that Alice's C-ratio falls below liquidation ratio")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String(BST), // currencyKey
        expandTo18Decimals(0.0038) // price
      )

      console.log(
        "test: Price of BTC drops such that Alice's C-ratio falls below liquidation ratio, Can mark position normally"
      )
      // Can mark position normally
      await expect(stack.liquidation.connect(yin).markPosition(alice.address, ethers.utils.formatBytes32String(BST)))
        .to.emit(stack.liquidation, "PositionMarked")
        .withArgs(
          alice.address, // user
          yin.address // marker
        )

      expect(await stack.liquidation.isPositionMarked(alice.address)).to.equal(true)
      expect(await stack.liquidation.getMarker(alice.address)).to.equal(yin.address)
      await passLiquidationDelay()

      console.log(
        "test: Price of BTC drops such that Alice's C-ratio falls below liquidation ratio, liquidatePositionMax"
      )
      console.log(
        "test: 10000 BST 100，20u -> unstak 5u<7500BST,15u> -> BST <price:0.01,c:75,max:15> -> BST <0.004,30,6> -> <0.0038,28.5,5.7>"
      )

      await expect(
        stack.liquidation.connect(yin).liquidatePositionMax(alice.address, ethers.utils.formatBytes32String(BST))
      ).to.emit(stack.liquidation, "PositionLiquidated")
    })

    it("can burn => liq，BST", async function () {
      // Alice stakes 10,000 BST and builds 20 FUSD
      console.log("test: Alice stakes 10,000 BST and builds 20 FUSD")

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String(BST), // currencyKey
        expandTo18Decimals(0.1) // price
      )
      await stack.platformToken.connect(admin).mint(
        alice.address, // account
        expandTo18Decimals(10_000) // amounts
      )
      await stack.platformToken.connect(alice).approve(
        stack.collateralSystem.address, // spender
        expandTo18Decimals(10_000) // amount
      )

      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String(BST), // _currency
        expandTo18Decimals(1_000), // _amount
        expandTo18Decimals(20), // amount
        0
      )

      const aliceFusd = await stack.fusdToken.balanceOf(alice.address)
      console.log(
        `aliceFusd: ${aliceFusd}, stack.fusdToken: ${stack.fusdToken.address}, alice.address: ${alice.address}`
      )
      expect(aliceFusd).to.equal(expandTo18Decimals(20))
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String(BST), // currencyKey
        expandTo18Decimals(0.035) // price
      )

      // Can mark position normally
      await stack.liquidation.connect(yin).markPosition(alice.address, ethers.utils.formatBytes32String(BST))

      await passLiquidationDelay()

      await expect(
        stack.liquidation.connect(yin).liquidatePositionMax(alice.address, ethers.utils.formatBytes32String(BST))
      ).to.emit(stack.liquidation, "PositionLiquidated")
    })
  })
})
