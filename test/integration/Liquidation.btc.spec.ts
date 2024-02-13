import { Duration } from "luxon"
import { ethers } from "hardhat"
import { BigNumber } from "ethers"
import { formatBytes32String } from "ethers/lib/utils"
import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { expandTo18Decimals, uint256Max } from "../utilities"
import { getBlockDateTime, setNextBlockTimestamp } from "../utilities/timeTravel"
import { deployWithMockPrice } from "../../scripts/testnet/localhost/deployWithMockPrice"
import { DeployedStackResult } from "../../scripts/testnet/deployParamTypes"

interface RewardData {
  lockToTime: BigNumber
  amount: BigNumber
}

describe("Integration | Stake Btc | Liquidation", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    charlie: SignerWithAddress

  const BTC = "BTC"

  let stack: DeployedStackResult

  const liquidationDelay: Duration = Duration.fromObject({ days: 3 })

  const passLiquidationDelay = async (): Promise<void> => {
    await setNextBlockTimestamp(
      ethers.provider,
      (await getBlockDateTime(ethers.provider)).plus(liquidationDelay).plus({ seconds: 1 })
    )
  }

  const setTokenPrice = async (price: number): Promise<void> => {
    await stack.prices.connect(admin).setPrice(
      ethers.utils.formatBytes32String(BTC), // currencyKey
      expandTo18Decimals(price) // price
    )
  }

  const stakeAndBuild = async (
    user: SignerWithAddress,
    stakeAmount: BigNumber,
    buildAmount: BigNumber
  ): Promise<void> => {
    await stack.collateralSystem.connect(user).stakeAndBuild(
      ethers.utils.formatBytes32String(BTC), // _currency
      stakeAmount, // _amount
      buildAmount,
      expandTo18Decimals(0)
    )
  }

  const assertUserCollateral = async (user: string, staked: BigNumber): Promise<void> => {
    const breakdown = await stack.collateralSystem.getUserCollateral(user, ethers.utils.formatBytes32String(BTC))
    expect(breakdown).to.equal(staked)
  }

  beforeEach(async function () {
    ;[deployer, alice, bob, charlie] = await ethers.getSigners()
    admin = deployer
    this.timeout(30000)

    stack = await deployWithMockPrice(deployer, admin)

    console.log("Set BTC price to $0.1")
    // Set BTC price to $0.1
    await setTokenPrice(0.1)

    // Grant Alice and Bob 1,000,000 BTC each
    for (const user of [alice, bob]) {
      await stack.btcToken.connect(admin).mint(user.address, expandTo18Decimals(1_000_000))
      await stack.btcToken.connect(user).approve(stack.collateralSystem.address, uint256Max)
    }

    console.log("Alice stakes 1,000 BTC ($100) and builds 20 FUSD")
    // alice stakes 1,000 BTC ($100) and builds 20 FUSD
    await stakeAndBuild(alice, expandTo18Decimals(1_000), expandTo18Decimals(20))

    console.log("Bob stake 1,000,000 BTC And builds 1,000 FUSD")
    // Bob stake 1,000,000 BTC And builds 1,000 FUSD
    await stakeAndBuild(bob, expandTo18Decimals(1_000_000), expandTo18Decimals((1_000_000 * 0.1) / 5))
  })
  context("context no name", async () => {
    it("can mark position only when C-ratio is below liquidation ratio", async () => {
      // Price of BTC changes to $0.04 such that Alice's C-ratio becomes 200%
      await setTokenPrice(0.04)

      console.log("xxxx-1")
      // Can't mark Alice's position as it's not *below* liquidation ratio
      await expect(
        stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BTC))
      ).to.be.revertedWith("Liquidation: not underCollateralized")

      // Price of BTC drops such that Alice's C-ratio falls below liquidation ratio
      await setTokenPrice(0.038)
      console.log("xxxx-2")

      // Can mark position normally
      await expect(stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BTC)))
        .to.emit(stack.liquidation, "PositionMarked")
        .withArgs(
          alice.address, // user
          bob.address // marker
        )
      console.log("xxxx-3")

      // Confirm mark
      expect(await stack.liquidation.isPositionMarked(alice.address)).to.equal(true)
      expect(await stack.liquidation.getMarker(alice.address)).to.equal(bob.address)
      console.log("xxxx-4")
    })

    it("can remove position mark only when C-ratio is not below issuance ratio", async () => {
      // Alice gets marked for liquidation
      await setTokenPrice(0.035)
      await stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BTC))

      // BTC price goes to $0.099. Alice cannot remove mark
      await setTokenPrice(0.099)

      await expect(
        stack.liquidation.connect(bob).removeMark(alice.address, ethers.utils.formatBytes32String(BTC))
      ).to.be.revertedWith("Liquidation: still underCollateralized")

      // BTC price goes to $0.1. Alice can now remove mark
      await setTokenPrice(0.1)
      await expect(stack.liquidation.connect(bob).removeMark(alice.address, ethers.utils.formatBytes32String(BTC)))
        .to.emit(stack.liquidation, "PositionUnmarked")
        .withArgs(
          alice.address // user
        )
    })

    it("cannot liquidate position without mark", async () => {
      // Alice should be liquidated at $0.035
      await setTokenPrice(0.035)

      await expect(
        stack.liquidation.connect(bob).liquidatePosition(alice.address, 1, ethers.utils.formatBytes32String(BTC))
      ).to.be.revertedWith("Liquidation: not marked for underCollateralized")
    })

    it("can liquidate position only when delay is passed", async () => {
      // Alice gets marked for liquidation
      await setTokenPrice(0.035)
      const markTime = (await getBlockDateTime(ethers.provider)).plus({
        days: 1,
      })
      await setNextBlockTimestamp(ethers.provider, markTime)
      await stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BTC))
      console.log("xxxx-1")

      // Cannot liquidate before delay is passed
      await setNextBlockTimestamp(ethers.provider, markTime.plus(liquidationDelay))
      await expect(
        stack.liquidation.connect(bob).liquidatePosition(alice.address, 1, ethers.utils.formatBytes32String(BTC))
      ).to.be.revertedWith("Liquidation: liquidation delay not passed")
      console.log("xxxx-2")

      // Can liquidate after delay is passed
      await setNextBlockTimestamp(ethers.provider, markTime.plus(liquidationDelay).plus({ seconds: 1 }))
      await stack.liquidation.connect(bob).liquidatePosition(alice.address, 1, ethers.utils.formatBytes32String(BTC))
      console.log("xxxx-3")
    })

    it("cannot liquidate position even if delay is passed if C-ratio is restored", async () => {
      // Alice gets marked for liquidation
      await setTokenPrice(0.035)
      await stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BTC))
      await passLiquidationDelay()

      // C-ratio restored but mark is not removed
      await setTokenPrice(0.1)

      // Position cannot be liquidated now
      await expect(
        stack.liquidation.connect(bob).liquidatePosition(alice.address, 1, ethers.utils.formatBytes32String(BTC))
      ).to.be.revertedWith("Liquidation: not underCollateralized")

      // C-ratio falls below issuance ratio
      await setTokenPrice(0.09)

      // Position can now be liquidated
      await stack.liquidation.connect(bob).liquidatePosition(alice.address, 1, ethers.utils.formatBytes32String(BTC))
    })

    it("can burn max amount directly without specifying concrete amount，BTC", async () => {
      // Same as last case
      await setTokenPrice(0.035)
      await stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BTC))
      await passLiquidationDelay()

      await stack.liquidation.connect(bob).liquidatePositionMax(alice.address, ethers.utils.formatBytes32String(BTC))

      // Mark is removed after buring the max amount
      expect(await stack.liquidation.isPositionMarked(alice.address)).to.equal(false)
    })

    it("can burn max amount directly without specifying concrete amount，BST", async () => {
      console.log("xxxxx-1")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.1) // price
      )

      await stack.platformToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
      console.log("xxxxx-2")

      await stack.platformToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

      console.log("xxxxx-3")

      await stack.collateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("BST"), // _currency
        expandTo18Decimals(1_000),
        expandTo18Decimals(20),
        0
      )
      console.log("xxxxx-4")

      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BST"), // currencyKey
        expandTo18Decimals(0.035) // price
      )
      await stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String("BST"))
      await passLiquidationDelay()

      await stack.liquidation.connect(bob).liquidatePositionMax(alice.address, ethers.utils.formatBytes32String("BST"))

      // Mark is removed after buring the max amount
      expect(await stack.liquidation.isPositionMarked(alice.address)).to.equal(false)
    })

    it("can liquidate up to the amount to restore C-ratio to issuance ratio", async () => {
      // Alice gets marked for liquidation
      console.log("Set BTC price to $0.035")
      await setTokenPrice(0.035)

      console.log("Alice gets marked for liquidation by bob")
      await stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BTC))
      console.log("passLiquidationDelay")
      await passLiquidationDelay()

      /**
       * // alice stakes 1,000 BTC ($100) and builds 20 FUSD
       * // now 1000 * 0.035 = 35 and build 7 FUSD, but must give reward to liquidator
       * Formula:
       *     Max FUSD to Burn = (Debt Balance - collateral Value * Issuance Ratio) / (1 - (1 + Liquidation Reward) * Issuance Ratio)
       *
       * Calculation:
       *     Max FUSD to Burn = (20 - 0.035 * 1000 * 0.2) / (1 - (1 + 0.15) * 0.2) = 16.883116883116883116
       *
       * Collateral withdrawal = 16.883116883116883116 / 0.035 = 482.374768089053803 BTC
       * Marker reward = 482.374768089053803 * 0.05 = 24.11873840445269 BTC
       * Liquidator reward = 482.374768089053803 * 0.1 = 48.2374768089053803 BTC
       * Total withdrawal = 482.374768089053803 + 24.11873840445269 + 48.2374768089053803 = 554.730983302412  BTC
       *
       * Alice's balance = 1000 - 554.730983302412 = 445.26901669758 BTC
       * Bob's balance = 1000000 + Total withdrawal = 1000554.730983302412 BTC
       *
       * Alice Ratio
       * Alice's balance * 0.035 = 15.5844155844153
       * Build Fusd = 15.5844155844153 / 5 = 3.11688311688306
       * current fusd = 20 - 16.883116883116883116 = 3.116883116883117
       * 由于不及时补仓，用户本来可以 build 7个的，现在只有 3.1 个
       *
       */
      const maxLusdToBurn = ethers.utils.parseEther("16.883116883116883116")

      console.log(`Burning 1 unit more FUSD fails, maxLusdToBurn:${maxLusdToBurn}"`)
      // Burning 1 unit more FUSD fails
      await expect(
        stack.liquidation
          .connect(bob)
          .liquidatePosition(alice.address, maxLusdToBurn.add(1), ethers.utils.formatBytes32String(BTC))
      ).to.be.revertedWith("Liquidation: burn amount too large")

      console.log("test: Can burn exactly the max amount")
      // Can burn exactly the max amount
      await expect(
        stack.liquidation
          .connect(bob)
          .liquidatePosition(alice.address, maxLusdToBurn, ethers.utils.formatBytes32String(BTC))
      )
        .to.emit(stack.liquidation, "PositionLiquidated")
        .withArgs(
          alice.address, // user
          bob.address, // marker
          bob.address, // liquidator
          ethers.utils.parseEther("16.883116883116883116"), // debtBurnt
          formatBytes32String(BTC), // collateralCurrency
          ethers.utils.parseEther("554.730983302411873810"), // collateralWithdrawnFromStaked
          ethers.utils.parseEther("24.118738404452690165"), // markerReward
          ethers.utils.parseEther("48.237476808905380331") // liquidatorReward
        )

      // Mark is removed after buring the max amount
      expect(await stack.liquidation.isPositionMarked(alice.address)).to.equal(false)
      console.log("assertUserCollateral alice")
      await assertUserCollateral(alice.address, BigNumber.from(expandTo18Decimals("445.269016697588126190")))
      console.log("assertUserCollateral bob")
      await assertUserCollateral(bob.address, BigNumber.from(expandTo18Decimals("1000554.730983302411873810")))

      //债务应该为0
      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BTC") // _currency
          )
        )[0]
      ).to.equal(ethers.utils.parseEther("20").sub(ethers.utils.parseEther("16.883116883116883116")))
    })

    it("liquidation of position backed by staked collateral, calc rewards", async () => {
      // Alice gets marked for liquidation by Charlie
      console.log("Set BTC price to $0.035")
      await setTokenPrice(0.035)
      console.log("Alice gets marked for liquidation by charlie")
      await stack.liquidation.connect(charlie).markPosition(alice.address, ethers.utils.formatBytes32String(BTC))
      console.log("passLiquidationDelay")
      await passLiquidationDelay()

      console.log("Bob liquidates Alice's position by burning 10 FUSD")
      // Bob liquidates Alice's position by burning 10 FUSD
      await expect(
        stack.liquidation
          .connect(bob)
          .liquidatePosition(alice.address, expandTo18Decimals(10), ethers.utils.formatBytes32String(BTC))
      )
        .to.emit(stack.liquidation, "PositionLiquidated")
        .withArgs(
          alice.address, // user
          charlie.address, // marker
          bob.address, // liquidator
          expandTo18Decimals(10), // debtBurnt
          formatBytes32String(BTC), // collateralCurrency
          BigNumber.from("328571428571428571427"), // collateralWithdrawnFromStaked
          BigNumber.from("14285714285714285714"), // markerReward
          BigNumber.from("28571428571428571428") // liquidatorReward
        )

      /**
       * // alice stakes 1,000 BTC ($100) and builds 20 FUSD
       * collateral withdrawal = 10 / 0.035 = 285.714285714285714285 BTC
       * Marker reward = 285.714285714285714285 * 0.05 = 14.285714285714285714 BTC
       * Liquidator reward = 285.714285714285714285 * 0.1 = 28.571428571428571428 BTC
       * Total withdrawal = 285.714285714285714285 + 14.285714285714285714 + 28.571428571428571428 = 328.571428571428571427 BTC
       *
       * Alice's balance = 1000 - 328.571428571428571427 = 671.428571428571428573 BTC
       * Bob's balance = 1000000 + 285.714285714285714285 + 28.571428571428571428 = 1000314.285714285714285713 BTC
       * Charlie's balance = 14.285714285714285714 BTC
       */
      console.log("assertUserCollateral alice == 671428571428571428573")
      await assertUserCollateral(alice.address, BigNumber.from("671428571428571428573"))

      console.log("assertUserCollateral bob == 1000314285714285714285713")
      await assertUserCollateral(bob.address, BigNumber.from("1000314285714285714285713"))
      console.log("assertUserCollateral charlie == 14285714285714285714")
      await assertUserCollateral(charlie.address, BigNumber.from("14285714285714285714"))
    })

    it("can not liquidation when price too low", async () => {
      // Alice gets marked for liquidation
      console.log("Set BTC price to $0.005")
      await setTokenPrice(0.005)

      console.log("Alice gets marked for liquidation by bob")
      await stack.liquidation.connect(bob).markPosition(alice.address, ethers.utils.formatBytes32String(BTC))
      console.log("passLiquidationDelay")
      await passLiquidationDelay()

      /**
       * // alice stakes 1,000 BTC ($100) and builds 20 FUSD
       * // now 1000 * 0.005 = 5 and build 1 FUSD, but must give reward to liquidator
       * Formula:
       *     Max FUSD to Burn = (Debt Balance - collateral Value * Issuance Ratio) / (1 - (1 + Liquidation Reward) * Issuance Ratio)
       *
       * Calculation:
       *     Max FUSD to Burn = (20 - 0.005 * 1000 * 0.2) / (1 - (1 + 0.15) * 0.2) = 24.6753
       *
       * Collateral withdrawal = 24.6753 / 0.005 = 4935.06 BTC
       * Marker reward = 4935.06 * 0.05 = 246.753 BTC
       * Liquidator reward = 4935.06 * 0.1 = 493.506 BTC
       * Total withdrawal = 4935.06 + 246.753 + 493.506 = 5675.319   BTC
       *
       * Alice's balance = 1000 - 5675.319 = -4675.319  BTC  ！！！
       * Bob's balance = 1000000 + Total withdrawal = 1005675.319 BTC
       *
       * Alice Ratio
       * Alice's balance * 0.005 = negative ！！！
       * Build Fusd = negative ！！！
       * current fusd = 20 - 24.6753 = negative ！！！
       * 由于不及时补仓，用户本来可以 build 7个的，现在只有 3.1 个
       *
       */
      const maxLusdToBurn = ethers.utils.parseEther("24.6753")

      console.log(`Burning 1 unit more FUSD fails, maxLusdToBurn:${maxLusdToBurn}"`)
      // Burning 1 unit more FUSD fails
      await expect(
        stack.liquidation
          .connect(bob)
          .liquidatePosition(alice.address, maxLusdToBurn.add(1), ethers.utils.formatBytes32String(BTC))
      ).to.be.revertedWith("Liquidation: insufficient collateral")

      console.log("test: Can burn exactly the max amount")
      // Can burn exactly the max amount
      await expect(
        stack.liquidation
          .connect(bob)
          .liquidatePosition(alice.address, maxLusdToBurn, ethers.utils.formatBytes32String(BTC))
      ).to.be.revertedWith("Liquidation: insufficient collateral")

      // Mark is removed after buring the max amount
      console.log("assertUserCollateral alice")
      await assertUserCollateral(alice.address, BigNumber.from(expandTo18Decimals("1000")))

      //债务应该为0
      expect(
        (
          await stack.debtSystem.GetUserDebtBalanceInUsd(
            alice.address, // _user
            ethers.utils.formatBytes32String("BTC") // _currency
          )
        )[0]
      ).to.equal(ethers.utils.parseEther("20"))
    })
  })
})
