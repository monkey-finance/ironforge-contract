import { ethers } from "hardhat"
import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { expandTo18Decimals, uint256Max } from "../utilities"
import { CollateralSystem, IronForgeToken } from "../../typechain"
import { deployWithMockPrice } from "../../scripts/testnet/localhost/deployWithMockPrice"
import { DeployedStackResult } from "../../scripts/testnet/deployParamTypes"
import { deployAddresses } from "../../scripts/utilities/deployAddresses"

describe("Integration | Build", function () {
  let deployer: SignerWithAddress, admin: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress

  let stack: DeployedStackResult

  beforeEach(async function () {
    this.timeout(30000)
    ;[deployer, alice, bob] = await ethers.getSigners()
    admin = deployer
    console.log("deployContractsStack")
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

    // Mint 1,000,000 BST to Alice
    await stack.platformToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))

    // Mint 1,000,000 BTC to Alice
    await stack.btcToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))

    await stack.platformToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)

    await stack.btcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)
    console.log("minerReward addPool")
    await stack.minerReward.addPool(1, stack.platformToken.address, stack.linearRelease.address, 0)
  })
  context("context no name", async () => {
    it("can not collateral unsupported token", async function () {
      // Alice stakes 9,000 BST
      await expect(
        stack.collateralSystem
          .connect(alice)
          .stakeAndBuild(ethers.utils.formatBytes32String("ADA"), expandTo18Decimals(9_000), 0, 0)
      ).revertedWith("invalid token symbol")
    })

    it("maxRedeemableToken() should return staked amount when debt is zero", async function () {
      // Alice stakes 9,000 BST
      await stack.collateralSystem
        .connect(alice)
        .stakeAndBuild(ethers.utils.formatBytes32String("BST"), expandTo18Decimals(9_000), 0, 0)

      // Returns 9,000 when locked amount is zero
      expect(
        await stack.collateralSystem.maxRedeemableToken(
          alice.address, // user
          ethers.utils.formatBytes32String("BST")
        )
      ).to.equal(expandTo18Decimals(9_000))
    }).timeout(300000)

    it("maxRedeemableToken() should return staked amount when debt is zero : btc", async function () {
      // Alice stakes 9,000 BTC
      // bytes32 stakeCurrency,
      //     uint256 stakeAmount,
      //     uint256 buildAmount,
      //     uint256 lockedAmount
      await stack.collateralSystem
        .connect(alice)
        .stakeAndBuild(ethers.utils.formatBytes32String("BTC"), expandTo18Decimals(9_000), 0, 0)

      // Returns 9,000 when locked amount is zero
      expect(
        await stack.collateralSystem.maxRedeemableToken(
          alice.address, // user
          ethers.utils.formatBytes32String("BTC")
        )
      ).to.equal(expandTo18Decimals(9_000))

      const collateralInUsd = await stack.collateralSystem.getUserCollateralInUsd(
        alice.address,
        ethers.utils.formatBytes32String("BTC")
      )
      expect(collateralInUsd).to.equal(expandTo18Decimals(9_000 * 100))
    })

    it("maxRedeemableToken() should reflect debt amount", async function () {
      // Alice stakes 9,000 BST
      await stack.collateralSystem
        .connect(alice)
        .stakeAndBuild(ethers.utils.formatBytes32String("BST"), expandTo18Decimals(9_000), expandTo18Decimals(10), 0)

      // 5,000 BST is set aside
      expect(
        await stack.collateralSystem.maxRedeemableToken(
          alice.address, // user
          ethers.utils.formatBytes32String("BST")
        )
      ).to.equal(expandTo18Decimals(4_000))
    })

    it("maxRedeemableToken() should reflect debt amount : btc", async function () {
      // Alice stakes 9,000 BTC
      await stack.collateralSystem
        .connect(alice)
        .stakeAndBuild(ethers.utils.formatBytes32String("BTC"), expandTo18Decimals(10), expandTo18Decimals(100), 0)

      // 5 BTC is set aside
      expect(
        await stack.collateralSystem.maxRedeemableToken(
          alice.address, // user
          ethers.utils.formatBytes32String("BTC")
        )
      ).to.equal(expandTo18Decimals(5))
    })

    it("stakeAndBuild with lock, catalyst 0.1 : btc", async function () {
      // Alice stakes <10 BTC，btc 100$, 1000$, can build 200$>
      // BST <100000, 0.1$, 10000, proportion > 1, catalyst 0.2*(1+0.1)=0.22, can build 220$>
      // notice: BST price get from dex
      const collateralSystem = stack.collateralSystem.connect(alice) as CollateralSystem
      const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        expandTo18Decimals(100_000)
      )

      await collateralSystem.stakeAndBuild(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        expandTo18Decimals(220),
        expandTo18Decimals(100_000)
      )

      const price = await stack.prices.getPrice(ethers.utils.formatBytes32String("BST"))
      const proportion = price.mul(100_000).div(10 * 100)
      const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
      console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

      expect(catalyst).to.be.equal("100000000000000000")
      expect(catalyst).to.be.equal(catalystEffectContract)
      expect(proportion).to.be.equal(proportionContract)
      expect(price).to.be.equal(priceContract)

      const [ratio, buildRatio] = await stack.collateralSystem.getRatio(
        alice.address, // user
        ethers.utils.formatBytes32String("BTC")
      )
      // 5 BTC is set aside
      expect(ratio).to.equal(expandTo18Decimals(0.22))
      expect(buildRatio).to.equal(expandTo18Decimals(0.2))
    })

    it("stakeAndBuild with lock, catalyst <0.1 : btc", async function () {
      // Alice stakes <10 BTC，btc 100$, 1000$, can build 200$>
      // BST <100, 0.1$, 10, proportion 0.01, catalyst lt 0.1 >
      // notice: BST price get from dex
      const platformTokenAmount = 100
      const collateralSystem = stack.collateralSystem.connect(alice) as CollateralSystem
      const [catalystEffectContract, proportionContract, priceContract] = await collateralSystem.getCatalystResult(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        expandTo18Decimals(platformTokenAmount)
      )
      console.log(`test: xxxx-1 catalystEffectContract:${catalystEffectContract}`)

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
      const proportion = price.mul(platformTokenAmount).div(100 * 10)

      const catalyst = await stack.publicCatalystMath.calcCatalyst(proportion)
      console.log(`test: price: ${price}, proportion: ${proportion}, catalyst: ${catalyst}`)

      expect(catalyst).to.be.equal(catalystEffectContract)
      expect(proportion).to.be.equal(proportionContract)
      expect(price).to.be.equal(priceContract)

      const buildRatio = await stack.config.connect(alice).getBuildRatio(ethers.utils.formatBytes32String("BTC"))
      const maxCanBuild = buildRatio
        .mul(catalyst.add(expandTo18Decimals(1)))
        .div(expandTo18Decimals(1))
        .mul(expandTo18Decimals(10 * 100))
        .div(expandTo18Decimals(1))
      console.log(`test: maxCanBuild: ${maxCanBuild}, buildRatio:${buildRatio}`)
      const platformToken = stack.platformToken as IronForgeToken

      const beforeAliceBalance = await platformToken.balanceOf(alice.address)
      await collateralSystem.stakeAndBuild(
        ethers.utils.formatBytes32String("BTC"),
        expandTo18Decimals(10),
        maxCanBuild,
        expandTo18Decimals(100)
      )

      expect(await platformToken.balanceOf(stack.minerReward.address)).to.be.equal(expandTo18Decimals(100))
      expect(await platformToken.balanceOf(alice.address)).to.be.equal(beforeAliceBalance.sub(expandTo18Decimals(100)))

      const [ratio1, buildRatio1] = await stack.collateralSystem.getRatio(
        alice.address, // user
        ethers.utils.formatBytes32String("BTC")
      )
      // 5 BTC is set aside
      expect(ratio1).to.equal(buildRatio.mul(catalyst.add(expandTo18Decimals(1))).div(expandTo18Decimals(1)))
      expect(buildRatio1).to.equal(expandTo18Decimals(0.2))
    })
  })
})
