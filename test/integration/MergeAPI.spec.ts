import { ethers } from "hardhat"
import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { expandTo18Decimals, uint256Max } from "../utilities"
import { CollateralSystem, IronForgeToken } from "../../typechain"

import { deployWithMockPrice } from "../../scripts/testnet/localhost/deployWithMockPrice"
import { DeployedStackResult } from "../../scripts/testnet/deployParamTypes"
import { advanceBlockTo, mineBlock } from "../utilities/timeTravel"

describe("Integration | Merge API: Stake/Build and Burn/Unstake", function () {
  let deployer: SignerWithAddress, admin: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress

  let stack: DeployedStackResult

  beforeEach(async function () {
    ;[deployer, alice, bob] = await ethers.getSigners()
    admin = deployer
    this.timeout(30000)

    stack = await deployWithMockPrice(deployer, admin)

    console.log("Set BST price to $0.01")
    await stack.prices.connect(admin).setPrice(
      ethers.utils.formatBytes32String("BST"), // currencyKey
      expandTo18Decimals(0.01) // price
    )
    console.log("Set BTC price to $100")
    await stack.prices.connect(admin).setPrice(
      ethers.utils.formatBytes32String("BTC"), // currencyKey
      expandTo18Decimals(100) // price
    )

    // Mint and approve 20,000 BST for Alice,bob
    await stack.platformToken.connect(admin).mint(
      alice.address, // account
      expandTo18Decimals(20_000) // amounts
    )
    await stack.platformToken.connect(admin).mint(
      bob.address, // account
      expandTo18Decimals(20_000) // amounts
    )
    await stack.platformToken.connect(alice).approve(
      stack.collateralSystem.address, // spender
      expandTo18Decimals(20_000) // amount
    )
    await stack.platformToken.connect(bob).approve(
      stack.collateralSystem.address, // spender
      expandTo18Decimals(20_000) // amount
    )

    // Mint 1,000,000 BTC to Alice
    await stack.btcToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
    await stack.btcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

    // Mint 1,000,000 ETH to Alice
    await stack.ethToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
    await stack.ethToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

    // Mint 1,000,000 ETH to Bob
    await stack.ethToken.connect(admin).mint(bob.address, expandTo18Decimals(1_000_000))
    await stack.ethToken.connect(bob).approve(stack.collateralSystem.address, uint256Max)

    // add stake pools for platform tokens
    // 30% reward for mint locked
    await stack.minerReward.addPool(1, stack.platformToken.address, stack.linearRelease.address, 0)
    await stack.minerReward.addPool(3, stack.platformToken.address, stack.linearRelease.address, 0)
    await stack.platformToken.connect(alice).approve(stack.minerReward.address, uint256Max)
    await stack.platformToken.connect(bob).approve(stack.minerReward.address, uint256Max)
  })
  context("context no name", async () => {
    it("can stake without building", async function () {
      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(20_000))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(0)

      // Alice can stake BST without building FUSD
      await expect(
        stack.collateralSystem.connect(alice).stakeAndBuild(
          ethers.utils.formatBytes32String("BST"), // stakeCurrency
          expandTo18Decimals(10_000), // stakeAmount
          0, // buildAmount
          0
        )
      )
        .to.emit(stack.collateralSystem, "CollateralLog")
        .and.not.emit(stack.debtSystem, "PushDebtLog")

      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(10_000))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(0)

      expect(
        await stack.collateralSystem.getUserCollateral(
          alice.address, // _user
          ethers.utils.formatBytes32String("BST") // _currency
        )
      ).to.equal(expandTo18Decimals(10_000))
      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BST") // _currency
          )
        )[0]
      ).to.equal(0)
    })

    it("can build without staking", async function () {
      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("BST"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        0, // buildAmount
        0
      )
      console.log("xxxxx-1")

      await expect(
        stack.collateralSystem.connect(alice).stakeAndBuild(
          ethers.utils.formatBytes32String("BST"), // stakeCurrency
          0, // stakeAmount
          expandTo18Decimals(10), // buildAmount
          0
        )
      )
        .to.emit(stack.debtSystem, "PushDebtLog")
        .and.not.emit(stack.collateralSystem, "CollateralLog")
      console.log("xxxxx-2")

      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(10_000))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(10))

      expect(
        await stack.collateralSystem.getUserCollateral(
          alice.address, // _user
          ethers.utils.formatBytes32String("BST") // _currency
        )
      ).to.equal(expandTo18Decimals(10_000))
      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BST") // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(10))
      console.log("xxxxx-3")
    })

    it("can stake and build atomically", async function () {
      await expect(
        stack.collateralSystem.connect(alice).stakeAndBuild(
          ethers.utils.formatBytes32String("BST"), // stakeCurrency
          expandTo18Decimals(10_000), // stakeAmount
          expandTo18Decimals(10), // buildAmount
          0
        )
      )
        .to.emit(stack.collateralSystem, "CollateralLog")
        .and.emit(stack.debtSystem, "PushDebtLog")

      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(10_000))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(10))

      expect(
        await stack.collateralSystem.getUserCollateral(
          alice.address, // _user
          ethers.utils.formatBytes32String("BST") // _currency
        )
      ).to.equal(expandTo18Decimals(10_000))
      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BST") // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(10))
    })

    it("can stake and build again", async function () {
      await expect(
        stack.collateralSystem.connect(alice).stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"), // stakeCurrency
          expandTo18Decimals(1), // stakeAmount
          expandTo18Decimals(1), // buildAmount
          0
        )
      )
        .to.emit(stack.collateralSystem, "CollateralLog")
        .and.emit(stack.debtSystem, "PushDebtLog")

      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(1))

      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BTC") // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(1))

      await expect(
        stack.collateralSystem.connect(alice).stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"), // stakeCurrency
          expandTo18Decimals(1), // stakeAmount
          expandTo18Decimals(1), // buildAmount
          expandTo18Decimals(1)
        )
      )
        .to.emit(stack.collateralSystem, "CollateralLog")
        .and.emit(stack.debtSystem, "PushDebtLog")

      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BTC") // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(2))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(2))

      await expect(
        stack.collateralSystem.connect(alice).stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"), // stakeCurrency
          expandTo18Decimals(1), // stakeAmount
          expandTo18Decimals(20), // buildAmount
          0
        )
      )
        .to.emit(stack.collateralSystem, "CollateralLog")
        .and.emit(stack.debtSystem, "PushDebtLog")

      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BTC") // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(22))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(22))
    })

    it("can burn without unstaking", async function () {
      // Alice stakes 10,000 BST and builds 20 FUSD
      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("BST"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        expandTo18Decimals(20), // stakeAmount
        0
      )

      await expect(
        stack.collateralSystem.connect(alice).burnAndUnstake(
          expandTo18Decimals(10), // burnAmount
          ethers.utils.formatBytes32String("BST"), // unStakeCurrency
          0 // unStakeAmount
        )
      )
        .to.emit(stack.debtSystem, "PushDebtLog")
        .and.not.emit(stack.collateralSystem, "RedeemCollateral")

      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(10_000))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(10))

      expect(
        await stack.collateralSystem.getUserCollateral(
          alice.address, // _user
          ethers.utils.formatBytes32String("BST") // _currency
        )
      ).to.equal(expandTo18Decimals(10_000))
      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BST") // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(10))
    })

    it("can unstake without burning", async function () {
      // Alice stakes 10,000 BST and builds 10 FUSD
      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("BST"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        expandTo18Decimals(10), // buildAmount
        0
      )

      await expect(
        stack.collateralSystem.connect(alice).burnAndUnstake(
          0, // burnAmount
          ethers.utils.formatBytes32String("BST"), // unStakeCurrency
          expandTo18Decimals(4_000) // unStakeAmount
        )
      )
        .to.emit(stack.collateralSystem, "RedeemCollateral")
        .and.not.emit(stack.debtSystem, "PushDebtLog")

      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(14_000))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(10))

      expect(
        await stack.collateralSystem.getUserCollateral(
          alice.address, // _user
          ethers.utils.formatBytes32String("BST") // _currency
        )
      ).to.equal(expandTo18Decimals(6_000))
      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BST") // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(10))
    })

    it("can burn and unstake atomically", async function () {
      // Alice stakes 10,000 BST and builds 20 FUSD
      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("BST"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        expandTo18Decimals(20), // stakeAmount
        0
      )

      await expect(
        stack.collateralSystem.connect(alice).burnAndUnstake(
          expandTo18Decimals(10), // burnAmount
          ethers.utils.formatBytes32String("BST"), // unStakeCurrency
          expandTo18Decimals(2_000) // unStakeAmount
        )
      )
        .to.emit(stack.debtSystem, "PushDebtLog")
        .and.emit(stack.collateralSystem, "RedeemCollateral")

      expect(await stack.platformToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(12_000))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(10))

      expect(
        await stack.collateralSystem.getUserCollateral(
          alice.address, // _user
          ethers.utils.formatBytes32String("BST") // _currency
        )
      ).to.equal(expandTo18Decimals(8_000))
      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BST") // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(10))
    })

    it("can burn and unstake max atomically", async function () {
      // Alice stakes 10,000 BST and builds 20 FUSD
      console.log("test: Alice stakes 10,000 BST and builds 20 FUSD")
      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("BST"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        expandTo18Decimals(20),
        0
      )

      console.log("test: Alice burnAndUnstakeMax 5u")
      await expect(
        stack.collateralSystem.connect(alice).burnAndUnstakeMax(
          expandTo18Decimals(5), // burnAmount
          ethers.utils.formatBytes32String("BST") // unStakeCurrency
        )
      )
        .to.emit(stack.debtSystem, "PushDebtLog")
        .and.emit(stack.collateralSystem, "RedeemCollateral")

      console.log("test: Alice stakes 10,000 BST and builds 20 FUSD again")
      await stack.platformToken.connect(admin).mint(
        alice.address, // account
        expandTo18Decimals(10_000) // amounts
      )
      await stack.platformToken.connect(alice).approve(
        stack.collateralSystem.address, // spender
        expandTo18Decimals(10_000) // amount
      )
      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("BST"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        expandTo18Decimals(20),
        0
      )

      console.log("test: Alice burnAndUnstakeMax 5 BST again")

      await stack.collateralSystem.connect(alice).burnAndUnstakeMax(
        expandTo18Decimals(5), // burnAmount
        ethers.utils.formatBytes32String("BST") // unStakeCurrency
      )

      console.log("test: bob stakes 10,000 BST and builds 20 FUSD")

      await stack.collateralSystem.connect(bob).stakeAndBuild(
        ethers.utils.formatBytes32String("BST"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        expandTo18Decimals(20),
        0
      )

      console.log("test: bob burnAndUnstakeMax 5 BST again")

      await stack.collateralSystem.connect(bob).burnAndUnstakeMax(
        expandTo18Decimals(5), // burnAmount
        ethers.utils.formatBytes32String("BST") // unStakeCurrency
      )

      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(30))

      console.log("test: Alice getUserCollateral BST")

      expect(
        await stack.collateralSystem.getUserCollateral(
          alice.address, // _user
          ethers.utils.formatBytes32String("BST") // _currency
        )
      ).to.equal(expandTo18Decimals(15_000))

      console.log("test: Alice GetUserDebtBalanceInUsd")

      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BST") // _currency
          )
        )[0]
      ).to.equal(expandTo18Decimals(30))
    })

    it("stakeAndBuild with lock, burn all and unlock BST", async function () {
      // Alice stakes <10 BTC，btc 100$, 1000$, can build 200$>
      // BST <100, 0.1$, 10, proportion 0.01, catalyst lt 0.1 >
      // notice: BST price get from dex
      console.log("Set BST price to $0.1")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.1) // price
      )
      const collateralSystem = stack.collateralSystem.connect(alice) as CollateralSystem
      const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        expandTo18Decimals(100)
      )
      console.log(`test: xxxx-1`)

      await stack.platformToken.connect(admin).transferOwnership(stack.minerReward.address)

      await expect(
        collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(10),
          expandTo18Decimals(300),
          expandTo18Decimals(100)
        )
      ).to.be.revertedWith("Build amount too big, you need more collateral")
      console.log(`test: xxxx-2`)

      // const [, price] = await stack.router.getAmountsOut(ethers.utils.parseEther("1"), [
      //   stack.platformToken.address,
      //   stack.usdcToken.address,
      // ])
      const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
      const proportion = price.mul(100).div(10 * 100)
      const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
      console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

      expect(catalyst).to.be.equal("14942653820485332")
      expect(catalyst).to.be.equal(catalystEffectContract)
      expect(proportion).to.be.equal(proportionContract)
      expect(price).to.be.equal(priceContract)
      console.log(`test: xxxx-3`)

      const buildRatio = await stack.config.connect(alice).getBuildRatio(ethers.utils.formatBytes32String("BTC"))
      const maxCanBuild = buildRatio
        .mul(catalyst.add(expandTo18Decimals(1)))
        .div(expandTo18Decimals(1))
        .mul(expandTo18Decimals(10 * 100))
        .div(expandTo18Decimals(1))
      console.log(`test: maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
      const platformToken = stack.platformToken as IronForgeToken
      console.log(`test: xxxx-4`)

      const beforeAliceBalance = await platformToken.balanceOf(alice.address)
      await collateralSystem.stakeAndBuild(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        maxCanBuild,
        expandTo18Decimals(100)
      )
      console.log(`test: xxxx-5`)

      expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
      expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(expandTo18Decimals(100))

      expect(await platformToken.balanceOf(alice.address)).to.be.equal(beforeAliceBalance.sub(expandTo18Decimals(100)))

      const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
        alice.address, // user
        ethers.utils.formatBytes32String("BTC")
      )
      expect(ratio1).to.equal(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
      expect(buildRatio1).to.equal(expandTo18Decimals(0.2))

      {
        const beforeAliceBalance = await platformToken.balanceOf(alice.address)

        await stack.collateralSystem.connect(alice).burnAndUnstakeMax(
          maxCanBuild, // burnAmount
          ethers.utils.formatBytes32String("BTC") // unStakeCurrency
        )
        console.log(`test: xxxx-7`)

        expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
        expect(await platformToken.balanceOf(alice.address)).to.be.equal(
          beforeAliceBalance.add(expandTo18Decimals(100).add(expandTo18Decimals(12.5))) // add 1 blocks stake reward: 100* 1/(1+3) * 1 * 0.5 = 12.5
        )

        expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(0))

        expect(
          await stack.collateralSystem.getUserCollateral(
            alice.address, // _user
            ethers.utils.formatBytes32String("BTC") // _currency
          )
        ).to.equal(expandTo18Decimals(0))

        expect(
          (
            await stack.debtSystem.GetUserDebtBalanceInUsd(
              alice.address, // _user
              ethers.utils.formatBytes32String("BTC") // _currency
            )
          )[0]
        ).to.equal(expandTo18Decimals(0))
      }
    })

    it("stakeAndBuild with lock, burn multi times and then unlock BST", async function () {
      // Alice stakes <10 BTC，btc 100$, 1000$, can build 200$>
      // BST <100, 0.1$, 10, proportion 0.01, catalyst lt 0.1 >
      // notice: BST price get from dex
      console.log("Set BST price to $0.1")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.1) // price
      )
      const collateralSystem = stack.collateralSystem.connect(alice) as CollateralSystem
      const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        expandTo18Decimals(100)
      )
      console.log(`test: xxxx-1`)

      await expect(
        collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(10),
          expandTo18Decimals(300),
          expandTo18Decimals(100)
        )
      ).to.be.revertedWith("Build amount too big, you need more collateral")
      console.log(`test: xxxx-2`)

      const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
      const proportion = price.mul(100).div(10 * 100)
      const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
      console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

      expect(catalyst).to.be.equal("14942653820485332")
      expect(catalyst).to.be.equal(catalystEffectContract)
      expect(proportion).to.be.equal(proportionContract)
      expect(price).to.be.equal(priceContract)
      console.log(`test: xxxx-3`)

      const buildRatio = await stack.config.connect(alice).getBuildRatio(ethers.utils.formatBytes32String("BTC"))
      const maxCanBuild = buildRatio
        .mul(catalyst.add(expandTo18Decimals(1)))
        .div(expandTo18Decimals(1))
        .mul(expandTo18Decimals(10 * 100))
        .div(expandTo18Decimals(1))
      console.log(`test: maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
      const platformToken = stack.platformToken as IronForgeToken
      console.log(`test: xxxx-4`)

      const beforeAliceBalance = await platformToken.balanceOf(alice.address)
      await collateralSystem.stakeAndBuild(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        maxCanBuild,
        expandTo18Decimals(100)
      )
      console.log(`test: xxxx-5`)

      expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
      expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(expandTo18Decimals(100))

      expect(await platformToken.balanceOf(alice.address)).to.be.equal(beforeAliceBalance.sub(expandTo18Decimals(100)))

      const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
        alice.address, // user
        ethers.utils.formatBytes32String("BTC")
      )
      expect(ratio1).to.equal(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
      expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal("202988530764097066000")

      // This is required
      await stack.platformToken.connect(admin).transferOwnership(stack.minerReward.address)

      {
        const beforeAliceBalance = await platformToken.balanceOf(alice.address)
        console.log(`test: xxxx-6`)

        // uint256 burnAmount,
        //   bytes32 unStakeCurrency,
        //   uint256 unStakeAmount
        await stack.collateralSystem.connect(alice).burnAndUnstake(
          maxCanBuild.div(2), // burnAmount
          ethers.utils.formatBytes32String("BTC"), // unStakeCurrency
          expandTo18Decimals(1)
        )
        console.log(`test: xxxx-7`)

        await stack.collateralSystem.connect(alice).burnAndUnstake(
          maxCanBuild.sub(maxCanBuild.div(2)), // burnAmount
          ethers.utils.formatBytes32String("BTC"), // unStakeCurrency
          expandTo18Decimals(9)
        )
        expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
        expect(await platformToken.balanceOf(alice.address)).to.be.equal(
          beforeAliceBalance.add(expandTo18Decimals(100).add(expandTo18Decimals(37.5))) // add 3 blocks stake reward: 100*1/(1+3)* 3 * 0.5 = 37.5
        )

        expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(0))

        expect(
          await stack.collateralSystem.getUserCollateral(
            alice.address, // _user
            ethers.utils.formatBytes32String("BTC") // _currency
          )
        ).to.equal(expandTo18Decimals(0))

        expect(
          (
            await stack.debtSystem.GetUserDebtBalanceInUsd(
              alice.address, // _user
              ethers.utils.formatBytes32String("BTC") // _currency
            )
          )[0]
        ).to.equal(expandTo18Decimals(0))
      }
    })

    it("stakeAndBuild with lock, btc price decrease, can not unlock BST", async function () {
      console.log("Set BST price to $0.1")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.1) // price
      )
      const platformTokenAmount = 10000
      const collateralSystem = stack.collateralSystem.connect(alice) as CollateralSystem
      const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        expandTo18Decimals(platformTokenAmount)
      )
      console.log(`test: xxxx-1`)

      await expect(
        collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(10),
          expandTo18Decimals(300),
          expandTo18Decimals(platformTokenAmount)
        )
      ).to.be.revertedWith("Build amount too big, you need more collateral")
      console.log(`test: xxxx-2`)

      const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
      const proportion = price.mul(platformTokenAmount).div(10 * 100)
      const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
      console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

      expect(catalyst).to.be.equal(ethers.utils.parseEther("0.1"))
      expect(catalyst).to.be.equal(catalystEffectContract)
      expect(proportion).to.be.equal(proportionContract)
      expect(price).to.be.equal(priceContract)
      console.log(`test: xxxx-3`)

      const buildRatio = await stack.config.connect(alice).getBuildRatio(ethers.utils.formatBytes32String("BTC"))
      const maxCanBuild = buildRatio
        .mul(catalyst.add(expandTo18Decimals(1)))
        .div(expandTo18Decimals(1))
        .mul(expandTo18Decimals(10 * 100))
        .div(expandTo18Decimals(1))
      console.log(`test: maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
      const platformToken = stack.platformToken as IronForgeToken
      console.log(`test: xxxx-4`)

      const beforeAliceBalance = await platformToken.balanceOf(alice.address)
      await collateralSystem.stakeAndBuild(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        maxCanBuild,
        expandTo18Decimals(platformTokenAmount)
      )
      console.log(`test: xxxx-5`)

      expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
      expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(
        expandTo18Decimals(platformTokenAmount)
      )
      expect(await platformToken.balanceOf(alice.address)).to.be.equal(
        beforeAliceBalance.sub(expandTo18Decimals(platformTokenAmount))
      )

      const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
        alice.address, // user
        ethers.utils.formatBytes32String("BTC")
      )
      expect(ratio1).to.equal(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
      expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(220))

      // This is required
      await stack.platformToken.connect(admin).transferOwnership(stack.minerReward.address)

      {
        const beforeAliceBalance = await platformToken.balanceOf(alice.address)
        console.log(`test: xxxx-6`)

        console.log("Set BTC price to $50")
        await stack.prices.connect(admin).setPrice(
          ethers.utils.formatBytes32String("BTC"), // currencyKey
          expandTo18Decimals(50) // price
        )

        // Alice stakes <10 BTC，btc 50, 500, can build 100$> current fusd is 220
        // btc升值了，buildratio就变大了，这个时候系统抵押物还是那么几个btc，1. 可以多铸造一些fusd，2. 如果不多铸造，可以取出一些抵押物
        // btc贬值了，1. 不能unstake抵押物 2. 可以燃烧债务，3. 如果没有fusd，可以去买再燃烧

        collateralSystem.burnAndUnstake(
          0, // burnAmount
          ethers.utils.formatBytes32String("BTC"), // unStakeCurrency
          expandTo18Decimals(10)
        )

        const maxRedeemableToken = await collateralSystem.maxRedeemableToken(
          alice.address,
          ethers.utils.formatBytes32String("BTC")
        )

        expect(maxRedeemableToken).to.be.equal(0)
        console.log(`test: maxRedeemableToken: ${maxRedeemableToken}`)
        await collateralSystem.burnAndUnstake(
          expandTo18Decimals(100),
          ethers.utils.formatBytes32String("BTC"), // unStakeCurrency
          0
        )
        expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
        expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(
          expandTo18Decimals(platformTokenAmount)
        )

        expect(await platformToken.balanceOf(alice.address)).to.be.equal(beforeAliceBalance.sub(expandTo18Decimals(0)))

        // 价格降低了，不能unstake，只能burn，burn 220-100 = 120，current ratio = 120/500 = 0.24, 410
        expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(120))

        expect(
          await stack.collateralSystem.getUserCollateral(
            alice.address, // _user
            ethers.utils.formatBytes32String("BTC") // _currency
          )
        ).to.equal(expandTo18Decimals(10))

        expect(
          (
            await stack.debtSystem.GetUserDebtBalanceInUsd(
              alice.address, // _user
              ethers.utils.formatBytes32String("BTC") // _currency
            )
          )[0]
        ).to.equal(expandTo18Decimals(120))

        // 燃烧到 ratio>(0.2,500)，120-100=20， 20/500=(0.04,2500)，现在只需要抵押100$可以，系统有10*50，可以取出8个btc

        // 输入大一点的，也只能redeem最大的8的情况
        collateralSystem.burnAndUnstake(
          expandTo18Decimals(100), // burnAmount
          ethers.utils.formatBytes32String("BTC"), // unStakeCurrency
          expandTo18Decimals(8.0000001)
        )

        // 这个时候催化剂还在系统里面
        expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
        expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(
          expandTo18Decimals(platformTokenAmount)
        )

        {
          const beforeAliceBalance = await platformToken.balanceOf(alice.address)
          // 把债务都燃烧了，催化剂应该自动打过去
          await collateralSystem.burnAndUnstake(
            expandTo18Decimals(20),
            ethers.utils.formatBytes32String("BTC"), // unStakeCurrency
            0
          )

          // add 6 blocks stake reward: 100*1/(1+3)*6*0.5 = 75，还有一部分没释放
          expect(await platformToken.balanceOf(alice.address)).to.be.equal(
            beforeAliceBalance.add(expandTo18Decimals(platformTokenAmount).add(expandTo18Decimals(75)))
          )

          // 还有两个btc没取出来
          expect(
            await stack.collateralSystem.getUserCollateral(
              alice.address, // _user
              ethers.utils.formatBytes32String("BTC") // _currency
            )
          ).to.equal(expandTo18Decimals(2))

          //债务应该为0
          expect(
            (
              await stack.debtSystem.GetUserDebtBalanceInUsd(
                alice.address, // _user
                ethers.utils.formatBytes32String("BTC") // _currency
              )
            )[0]
          ).to.equal(expandTo18Decimals(0))
        }
      }
    })

    it("stakeAndBuild with lock, and build with catalyst next time", async function () {
      /**
     第一次
     催化剂 1000
     比例 1
     催化效果 0.1
     Buildratio = (0.1+1)*0.2=0.22
     铸造 1000 * 0.22 = 220.0

     第二次
     抵押 10btc 100$ = 1000
     催化剂 0
     比例 1000 / (1000+1000)=0.5
     催化效果 0.085165
     Buildratio = ( 0.085165 + 1) * 0.22 = 0.238736
     铸造 1000 *  0.238736 = 238.736
     验证此算法是否正确  (238.736+220) / 2000 = 0.2294  对的，中间的一个值
     */
      console.log("Set BST price to $0.1")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.1) // price
      )
      console.log("Set BTC price to $100")

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BTC"), // currencyKey
        expandTo18Decimals(100) // price
      )

      const catalystTokenAmount = 10000
      const collateralSystem = stack.collateralSystem.connect(alice) as CollateralSystem
      // 锁仓/抵押物 = 1
      const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        expandTo18Decimals(catalystTokenAmount)
      )
      console.log(`test: first xxxx-1`)

      await expect(
        collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(10),
          expandTo18Decimals(300),
          expandTo18Decimals(catalystTokenAmount)
        )
      ).to.be.revertedWith("Build amount too big, you need more collateral")
      console.log(`test: first xxxx-2`)

      const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
      const proportion = price.mul(catalystTokenAmount).div(10 * 100)
      const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
      console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

      expect(catalyst).to.be.equal(ethers.utils.parseEther("0.1"))
      expect(catalyst).to.be.equal(catalystEffectContract)
      expect(proportion).to.be.equal(proportionContract)
      expect(price).to.be.equal(priceContract)
      console.log(`test: first xxxx-3`)
      const buildRatio = await stack.config.connect(alice).getBuildRatio(ethers.utils.formatBytes32String("BTC"))
      const maxCanBuild = buildRatio
        .mul(catalyst.add(expandTo18Decimals(1)))
        .div(expandTo18Decimals(1))
        .mul(expandTo18Decimals(10 * 100))
        .div(expandTo18Decimals(1))
      console.log(`test: first maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
      const platformToken = stack.platformToken as IronForgeToken
      console.log(`test: first xxxx-4`)

      const beforeAliceBalance = await platformToken.balanceOf(alice.address)
      await collateralSystem.stakeAndBuild(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        maxCanBuild,
        expandTo18Decimals(catalystTokenAmount)
      )
      console.log(`test: first xxxx-5`)

      expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
      expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(
        expandTo18Decimals(catalystTokenAmount)
      )

      expect(await platformToken.balanceOf(alice.address)).to.be.equal(
        beforeAliceBalance.sub(expandTo18Decimals(catalystTokenAmount))
      )

      const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
        alice.address, // user
        ethers.utils.formatBytes32String("BTC")
      )
      expect(ratio1).to.equal(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
      expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(220))

      // 这个人再铸造一次
      {
        // 锁仓0/(抵押物10+10) = 0.5， 这里填catalystTokenAmount就是0的意思，第二次没有lock
        const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(20),
          expandTo18Decimals(catalystTokenAmount)
        )

        const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
        const stakeAmount = 20 // 这次再抵押10个，加上上次的就是20个
        const proportion = price.mul(catalystTokenAmount).div(stakeAmount * 100)
        const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
        console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

        expect(catalyst).to.be.equal("85164568905933068")
        expect(catalyst).to.be.equal(catalystEffectContract)
        expect(proportion).to.be.equal(proportionContract)
        expect(price).to.be.equal(priceContract)
        console.log(`test: xxxx-3`)
        // 注意此时buildratio不是default
        const buildRatio = (
          await stack.collateralSystem.getRatio(alice.address, ethers.utils.formatBytes32String("BTC"))
        )[0]

        const maxCanBuild = buildRatio
          .mul(catalyst.add(expandTo18Decimals(1)))
          .div(expandTo18Decimals(1))
          .mul(expandTo18Decimals(10 * 100))
          .div(expandTo18Decimals(1))
        console.log(`test: maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
        const platformToken = stack.platformToken as IronForgeToken
        console.log(`test: xxxx-4`)

        const beforeAliceBalance = await platformToken.balanceOf(alice.address)
        await collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(10),
          maxCanBuild,
          expandTo18Decimals(0) //这次不加催化剂，看看上次的有效果没
        )
        console.log(`test: xxxx-5`)

        expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
        expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(
          expandTo18Decimals(catalystTokenAmount)
        )

        expect(await platformToken.balanceOf(alice.address)).to.be.equal(beforeAliceBalance.sub(expandTo18Decimals(0)))

        const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
          alice.address, // user
          ethers.utils.formatBytes32String("BTC")
        )
        const [debt] = await stack.debtSystem.GetUserDebtBalanceInUsd(
          alice.address,
          ethers.utils.formatBytes32String("BTC")
        )
        const collateral = await stack.collateralSystem.getUserCollateral(
          alice.address,
          ethers.utils.formatBytes32String("BTC")
        )
        const btcPrice = await stack.prices.getPrice(ethers.utils.formatBytes32String("BTC"))
        console.log(`debt: ${debt}, collateral: ${collateral}, btcPrice: ${btcPrice}`)
        expect(ratio1).to.lt(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
        expect(ratio1).to.eq(debt.mul(expandTo18Decimals(1)).div(collateral.mul(btcPrice).div(expandTo18Decimals(1))))

        expect(ratio1).to.equal("229368102579652637")
        expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
        expect(await stack.fusdToken.balanceOf(alice.address)).to.equal("458736205159305274000")
      }
    })

    //不同的抵押币的催化剂之间不会互相影响
    it("alice stakeAndBuild with lock, and build with other token next time", async function () {
      await stack.platformToken.connect(admin).transferOwnership(stack.minerReward.address)

      console.log("Set BST price to $0.1")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.1) // price
      )
      console.log("Set BTC price to $100")

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BTC"), // currencyKey
        expandTo18Decimals(100) // price
      )

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("ETH"), // currencyKey
        expandTo18Decimals(100) // price
      )

      const catalystTokenAmount = 10000
      const collateralSystem = stack.collateralSystem.connect(alice) as CollateralSystem
      // 锁仓/抵押物 = 1
      const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        expandTo18Decimals(catalystTokenAmount)
      )
      console.log(`test: first xxxx-1`)

      await expect(
        collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(10),
          expandTo18Decimals(300),
          expandTo18Decimals(catalystTokenAmount)
        )
      ).to.be.revertedWith("Build amount too big, you need more collateral")
      console.log(`test: first xxxx-2`)

      const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
      const proportion = price.mul(catalystTokenAmount).div(10 * 100)
      const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
      console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

      expect(catalyst).to.be.equal(ethers.utils.parseEther("0.1"))
      expect(catalyst).to.be.equal(catalystEffectContract)
      expect(proportion).to.be.equal(proportionContract)
      expect(price).to.be.equal(priceContract)
      console.log(`test: first xxxx-3`)
      const buildRatio = await stack.config.connect(alice).getBuildRatio(ethers.utils.formatBytes32String("BTC"))
      const maxCanBuild = buildRatio
        .mul(catalyst.add(expandTo18Decimals(1)))
        .div(expandTo18Decimals(1))
        .mul(expandTo18Decimals(10 * 100))
        .div(expandTo18Decimals(1))
      console.log(`test: first maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
      const platformToken = stack.platformToken as IronForgeToken
      console.log(`test: first xxxx-4`)

      const beforeAliceBalance = await platformToken.balanceOf(alice.address)
      await collateralSystem.stakeAndBuild(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        maxCanBuild,
        expandTo18Decimals(catalystTokenAmount)
      )
      console.log(`test: first xxxx-5`)

      expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
      expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(
        expandTo18Decimals(catalystTokenAmount)
      )

      expect(await platformToken.balanceOf(alice.address)).to.be.equal(
        beforeAliceBalance.sub(expandTo18Decimals(catalystTokenAmount))
      )

      const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
        alice.address, // user
        ethers.utils.formatBytes32String("BTC")
      )
      expect(ratio1).to.equal(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
      expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(220))

      // 这个人再用eth铸造一次
      {
        console.log("use eth to build......")
        const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
          ethers.utils.formatBytes32String("ETH"),
          expandTo18Decimals(10),
          expandTo18Decimals(catalystTokenAmount)
        )

        const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
        const stakeAmount = 10 // 这次再抵押10个，加上上次的就是20个
        const proportion = price.mul(catalystTokenAmount).div(stakeAmount * 100)
        const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
        console.log(`test eth: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

        expect(catalyst).to.be.equal(catalystEffectContract)
        expect(proportion).to.be.equal(proportionContract)
        expect(price).to.be.equal(priceContract)
        console.log(`test eth: xxxx-3`)
        const buildRatio = (
          await stack.collateralSystem.getRatio(alice.address, ethers.utils.formatBytes32String("ETH"))
        )[0]

        const maxCanBuild = buildRatio
          .mul(catalyst.add(expandTo18Decimals(1)))
          .div(expandTo18Decimals(1))
          .mul(expandTo18Decimals(10 * 100))
          .div(expandTo18Decimals(1))
        console.log(`test eth: maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
        const platformToken = stack.platformToken as IronForgeToken
        console.log(`test eth: xxxx-4`)

        const beforeAliceBalance = await platformToken.balanceOf(alice.address)
        await collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("ETH"),
          expandTo18Decimals(10),
          maxCanBuild,
          expandTo18Decimals(catalystTokenAmount)
        )
        console.log(`test eth: xxxx-5`)

        expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
        expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.gt(
          expandTo18Decimals(catalystTokenAmount * 2)
        ) //deposit会有一些奖励

        expect(await platformToken.balanceOf(alice.address)).to.be.equal(
          beforeAliceBalance.sub(expandTo18Decimals(catalystTokenAmount))
        )

        const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
          alice.address, // user
          ethers.utils.formatBytes32String("ETH")
        )
        const [debt] = await stack.debtSystem.GetUserDebtBalanceInUsd(
          alice.address,
          ethers.utils.formatBytes32String("ETH")
        )
        const collateral = await stack.collateralSystem.getUserCollateral(
          alice.address,
          ethers.utils.formatBytes32String("ETH")
        )
        const btcPrice = await stack.prices.getPrice(ethers.utils.formatBytes32String("ETH"))
        console.log(`debt: ${debt}, collateral: ${collateral}, btcPrice: ${btcPrice}`)
        expect(ratio1).to.eq(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
        expect(ratio1).to.eq(debt.mul(expandTo18Decimals(1)).div(collateral.mul(btcPrice).div(expandTo18Decimals(1))))

        expect(ratio1).to.equal("220000000000000000")
        expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
        expect(await stack.fusdToken.balanceOf(alice.address)).to.equal("440000000000000000000")
      }

      // 这个人再用btc铸造一次
      {
        // 锁仓0/(抵押物10+10) = 0.5， 这里填catalystTokenAmount就是0的意思，第二次没有lock
        const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(20),
          expandTo18Decimals(catalystTokenAmount)
        )

        const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
        const stakeAmount = 20 // 这次再抵押10个，加上上次的就是20个
        const proportion = price.mul(catalystTokenAmount).div(stakeAmount * 100)
        const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
        console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

        expect(catalyst).to.be.equal("85164568905933068")
        expect(catalyst).to.be.equal(catalystEffectContract)
        expect(proportion).to.be.equal(proportionContract)
        expect(price).to.be.equal(priceContract)
        console.log(`test: xxxx-3`)
        // 注意此时buildratio不是default
        const buildRatio = (
          await stack.collateralSystem.getRatio(alice.address, ethers.utils.formatBytes32String("BTC"))
        )[0]

        const maxCanBuild = buildRatio
          .mul(catalyst.add(expandTo18Decimals(1)))
          .div(expandTo18Decimals(1))
          .mul(expandTo18Decimals(10 * 100))
          .div(expandTo18Decimals(1))
        console.log(`test: maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
        const platformToken = stack.platformToken as IronForgeToken
        console.log(`test: xxxx-4`)

        const beforeAliceBalance = await platformToken.balanceOf(alice.address)
        await collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(10),
          maxCanBuild,
          expandTo18Decimals(0) //这次不加催化剂，看看上次的有效果没
        )
        console.log(`test: xxxx-5`)

        expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
        expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.gt(
          expandTo18Decimals(catalystTokenAmount * 2)
        ) //deposit有一些奖励

        expect(await platformToken.balanceOf(alice.address)).to.be.equal(beforeAliceBalance.sub(expandTo18Decimals(0)))

        const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
          alice.address, // user
          ethers.utils.formatBytes32String("BTC")
        )
        const [debt] = await stack.debtSystem.GetUserDebtBalanceInUsd(
          alice.address,
          ethers.utils.formatBytes32String("BTC")
        )
        const collateral = await stack.collateralSystem.getUserCollateral(
          alice.address,
          ethers.utils.formatBytes32String("BTC")
        )
        const btcPrice = await stack.prices.getPrice(ethers.utils.formatBytes32String("BTC"))
        console.log(`debt: ${debt}, collateral: ${collateral}, btcPrice: ${btcPrice}`)
        expect(ratio1).to.lt(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
        expect(ratio1).to.eq(debt.mul(expandTo18Decimals(1)).div(collateral.mul(btcPrice).div(expandTo18Decimals(1))))

        expect(ratio1).to.equal("229368102579652637")
        expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
        expect(await stack.fusdToken.balanceOf(alice.address)).to.equal("678736205159305274000")
      }
    })

    //不同用户，不同抵押币加催化剂不会互相影响
    it("alice stakeAndBuild with lock, bob build with other token，Alice build next time", async function () {
      await stack.platformToken.connect(admin).transferOwnership(stack.minerReward.address)

      console.log("Set BST price to $0.1")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.1) // price
      )
      console.log("Set BTC price to $100")

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BTC"), // currencyKey
        expandTo18Decimals(100) // price
      )

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("ETH"), // currencyKey
        expandTo18Decimals(100) // price
      )

      const catalystTokenAmount = 10000
      const collateralSystem = stack.collateralSystem.connect(alice) as CollateralSystem
      // 锁仓/抵押物 = 1
      const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        expandTo18Decimals(catalystTokenAmount)
      )
      console.log(`test: first xxxx-1`)

      await expect(
        collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(10),
          expandTo18Decimals(300),
          expandTo18Decimals(catalystTokenAmount)
        )
      ).to.be.revertedWith("Build amount too big, you need more collateral")
      console.log(`test: first xxxx-2`)

      const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
      const proportion = price.mul(catalystTokenAmount).div(10 * 100)
      const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
      console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

      expect(catalyst).to.be.equal(ethers.utils.parseEther("0.1"))
      expect(catalyst).to.be.equal(catalystEffectContract)
      expect(proportion).to.be.equal(proportionContract)
      expect(price).to.be.equal(priceContract)
      console.log(`test: first xxxx-3`)
      const buildRatio = await stack.config.connect(alice).getBuildRatio(ethers.utils.formatBytes32String("BTC"))
      const maxCanBuild = buildRatio
        .mul(catalyst.add(expandTo18Decimals(1)))
        .div(expandTo18Decimals(1))
        .mul(expandTo18Decimals(10 * 100))
        .div(expandTo18Decimals(1))
      console.log(`test: first maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
      const platformToken = stack.platformToken as IronForgeToken
      console.log(`test: first xxxx-4`)

      const beforeAliceBalance = await platformToken.balanceOf(alice.address)
      await collateralSystem.stakeAndBuild(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        maxCanBuild,
        expandTo18Decimals(catalystTokenAmount)
      )
      console.log(`test: first xxxx-5`)

      expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
      expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(
        expandTo18Decimals(catalystTokenAmount)
      )

      expect(await platformToken.balanceOf(alice.address)).to.be.equal(
        beforeAliceBalance.sub(expandTo18Decimals(catalystTokenAmount))
      )

      const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
        alice.address, // user
        ethers.utils.formatBytes32String("BTC")
      )
      expect(ratio1).to.equal(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
      expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
      expect(await stack.fusdToken.balanceOf(alice.address)).to.equal(expandTo18Decimals(220))

      // bob再用eth铸造一次
      {
        console.log("use eth to build......")
        const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
          ethers.utils.formatBytes32String("ETH"),
          expandTo18Decimals(10),
          expandTo18Decimals(catalystTokenAmount)
        )

        const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
        const stakeAmount = 10 // 这次再抵押10个，加上上次的就是20个
        const proportion = price.mul(catalystTokenAmount).div(stakeAmount * 100)
        const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
        console.log(`test eth: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

        expect(catalyst).to.be.equal(catalystEffectContract)
        expect(proportion).to.be.equal(proportionContract)
        expect(price).to.be.equal(priceContract)
        console.log(`test eth: xxxx-3`)
        const buildRatio = (
          await stack.collateralSystem.getRatio(bob.address, ethers.utils.formatBytes32String("ETH"))
        )[0]

        const maxCanBuild = buildRatio
          .mul(catalyst.add(expandTo18Decimals(1)))
          .div(expandTo18Decimals(1))
          .mul(expandTo18Decimals(10 * 100))
          .div(expandTo18Decimals(1))
        console.log(`test eth: maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
        const platformToken = stack.platformToken as IronForgeToken
        console.log(`test eth: xxxx-4`)

        const beforeBobBalance = await platformToken.balanceOf(bob.address)
        await collateralSystem
          .connect(bob)
          .stakeAndBuild(
            ethers.utils.formatBytes32String("ETH"),
            expandTo18Decimals(10),
            maxCanBuild,
            expandTo18Decimals(catalystTokenAmount)
          )
        console.log(`test eth: xxxx-5`)

        expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
        expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.gt(
          expandTo18Decimals(catalystTokenAmount * 2)
        ) //deposit会有一些奖励

        expect(await platformToken.balanceOf(bob.address)).to.be.equal(
          beforeBobBalance.sub(expandTo18Decimals(catalystTokenAmount))
        )

        const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
          bob.address, // user
          ethers.utils.formatBytes32String("ETH")
        )
        const [debt] = await stack.debtSystem.GetUserDebtBalanceInUsd(
          bob.address,
          ethers.utils.formatBytes32String("ETH")
        )
        const collateral = await stack.collateralSystem.getUserCollateral(
          bob.address,
          ethers.utils.formatBytes32String("ETH")
        )
        const btcPrice = await stack.prices.getPrice(ethers.utils.formatBytes32String("ETH"))
        console.log(`debt: ${debt}, collateral: ${collateral}, btcPrice: ${btcPrice}`)
        expect(ratio1).to.eq(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
        expect(ratio1).to.eq(debt.mul(expandTo18Decimals(1)).div(collateral.mul(btcPrice).div(expandTo18Decimals(1))))

        expect(ratio1).to.equal("220000000000000000")
        expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
        expect(await stack.fusdToken.balanceOf(bob.address)).to.equal("220000000000000000000")
      }

      // alice再用btc铸造一次
      {
        // 锁仓0/(抵押物10+10) = 0.5， 这里填catalystTokenAmount就是0的意思，第二次没有lock
        const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(20),
          expandTo18Decimals(catalystTokenAmount)
        )

        const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
        const stakeAmount = 20 // 这次再抵押10个，加上上次的就是20个
        const proportion = price.mul(catalystTokenAmount).div(stakeAmount * 100)
        const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
        console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

        expect(catalyst).to.be.equal("85164568905933068")
        expect(catalyst).to.be.equal(catalystEffectContract)
        expect(proportion).to.be.equal(proportionContract)
        expect(price).to.be.equal(priceContract)
        console.log(`test: xxxx-3`)
        // 注意此时buildratio不是default
        const buildRatio = (
          await stack.collateralSystem.getRatio(alice.address, ethers.utils.formatBytes32String("BTC"))
        )[0]

        const maxCanBuild = buildRatio
          .mul(catalyst.add(expandTo18Decimals(1)))
          .div(expandTo18Decimals(1))
          .mul(expandTo18Decimals(10 * 100))
          .div(expandTo18Decimals(1))
        console.log(`test: maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
        const platformToken = stack.platformToken as IronForgeToken
        console.log(`test: xxxx-4`)

        const beforeAliceBalance = await platformToken.balanceOf(alice.address)
        await collateralSystem.stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"),
          expandTo18Decimals(10),
          maxCanBuild,
          expandTo18Decimals(0) //这次不加催化剂，看看上次的有效果没
        )
        console.log(`test: xxxx-5`)

        expect(await platformToken.balanceOf(collateralSystem.address)).to.be.equal(expandTo18Decimals(0))
        expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.gt(
          expandTo18Decimals(catalystTokenAmount * 2)
        ) //deposit有一些奖励

        expect(await platformToken.balanceOf(alice.address)).to.be.equal(beforeAliceBalance.sub(expandTo18Decimals(0)))

        const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
          alice.address, // user
          ethers.utils.formatBytes32String("BTC")
        )
        const [debt] = await stack.debtSystem.GetUserDebtBalanceInUsd(
          alice.address,
          ethers.utils.formatBytes32String("BTC")
        )
        const collateral = await stack.collateralSystem.getUserCollateral(
          alice.address,
          ethers.utils.formatBytes32String("BTC")
        )
        const btcPrice = await stack.prices.getPrice(ethers.utils.formatBytes32String("BTC"))
        console.log(`debt: ${debt}, collateral: ${collateral}, btcPrice: ${btcPrice}`)
        expect(ratio1).to.lt(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
        expect(ratio1).to.eq(debt.mul(expandTo18Decimals(1)).div(collateral.mul(btcPrice).div(expandTo18Decimals(1))))

        expect(ratio1).to.equal("229368102579652637")
        expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
        expect(await stack.fusdToken.balanceOf(alice.address)).to.equal("458736205159305274000")
      }
    })
  })
})
