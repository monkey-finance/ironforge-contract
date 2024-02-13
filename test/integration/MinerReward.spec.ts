import { ethers, upgrades } from "hardhat"
import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { MockERC20, MockERC20__factory } from "../../typechain"
import { mineBlock } from "../utilities/timeTravel"
import { deployWithMockPrice } from "../../scripts/testnet/localhost/deployWithMockPrice"
import { DeployedStackResult } from "../../scripts/testnet/deployParamTypes"
import { expandTo18Decimals, uint256Max } from "../utilities"
describe("Integration | MinerReward", function () {
  let deployer: SignerWithAddress, admin: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress

  let stack: DeployedStackResult
  let stakingTokens: MockERC20[] = []
  let stoken0: MockERC20

  const passBlocks = async (num: number) => {
    for (let i = 0; i < num; i++) {
      await mineBlock(ethers.provider)
    }
  }
  beforeEach(async function () {
    ;[deployer, alice, bob] = await ethers.getSigners()
    admin = deployer
    this.timeout(30000)

    const tokenFactory = (await ethers.getContractFactory("MockERC20")) as unknown as MockERC20__factory

    stack = await deployWithMockPrice(deployer, admin)

    for (let i = 0; i < 4; i++) {
      const stoken = (await tokenFactory.deploy(
        `LP1${i}`, // _name
        `LP1${i}` // _symbol
      )) as MockERC20
      stakingTokens.push(stoken)
    }

    stoken0 = (await tokenFactory.deploy(
      "LP", // _name
      "LP" // _symbol
    )) as MockERC20
    await stoken0.connect(admin).mint(alice.address, ethers.utils.parseEther("2000"))
    await stoken0.connect(alice).approve(stack.minerReward.address, ethers.utils.parseEther("2000"))
    await stoken0.connect(admin).mint(bob.address, ethers.utils.parseEther("2000"))
    await stoken0.connect(bob).approve(stack.minerReward.address, ethers.utils.parseEther("2000"))
    await stoken0.connect(deployer).approve(stack.minerReward.address, ethers.utils.parseEther("2000"))

    await stack.platformToken.connect(admin).mint(admin.address, ethers.utils.parseEther("1000"))
    await stack.platformToken.connect(admin).transferOwnership(stack.minerReward.address)
  })
  context("context no name", async () => {
    it("should add new pool", async () => {
      for (let i = 0; i < 4; i++) {
        await stack.minerReward.connect(admin).addPool(i, stakingTokens[i].address, stack.linearRelease.address, 0)
      }
      expect(await stack.minerReward.poolLength()).to.eq(4)
    })

    it("should success when add duplicate pool", async () => {
      await stack.minerReward.connect(admin).addPool(1, stakingTokens[1].address, stack.linearRelease.address, 0)
      await stack.minerReward.connect(admin).addPool(1, stakingTokens[1].address, stack.linearRelease.address, 0)
      expect(await stack.minerReward.poolLength()).to.be.eq(2)
    })

    it("should revert when withdrawer is not funder", async () => {
      await stack.minerReward.connect(admin).addPool(1, stoken0.address, stack.linearRelease.address, 0)

      await stack.minerReward.connect(alice).deposit(bob.address, 0, ethers.utils.parseEther("1000"))

      await expect(
        stack.minerReward.connect(bob).withdraw(bob.address, 0, ethers.utils.parseEther("1000"))
      ).to.be.revertedWith("MinerReward::withdraw:: only funder")
    })

    it("should get correct amount back if funder withdraw", async () => {
      await stack.minerReward.connect(admin).addPool(1, stoken0.address, stack.linearRelease.address, 0)
      await stack.minerReward.connect(alice).deposit(bob.address, 0, ethers.utils.parseEther("2000"))
      expect(await stoken0.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("0"))
      console.log("alice address: ", alice.address)
      console.log("bob address: ", bob.address)

      await stack.minerReward.connect(alice).withdraw(bob.address, 0, ethers.utils.parseEther("2000"))
      expect(await stoken0.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("2000"))
    })

    it("should revert when two accounts want to fund the same user", async () => {
      await stack.minerReward.connect(admin).addPool(1, stoken0.address, stack.linearRelease.address, 0)
      await stack.minerReward.connect(alice).deposit(bob.address, 0, ethers.utils.parseEther("2000"))
      await expect(
        stack.minerReward.connect(deployer).deposit(bob.address, 0, ethers.utils.parseEther("2000"))
      ).to.be.revertedWith("MinerReward::deposit:: bad sof")
    })

    it("should harvest yield from opend position", async () => {
      await stack.minerReward.connect(admin).addPool(1, stoken0.address, stack.linearRelease.address, 0)
      await stack.minerReward.connect(alice).deposit(bob.address, 0, ethers.utils.parseEther("2000"))
      await stack.minerReward.connect(bob).harvest(0)
      // reward receiver is bob, bob can harvest the reward
      expect(await stack.platformToken.balanceOf(bob.address)).to.eq(ethers.utils.parseEther("50"))
      await stack.minerReward.connect(alice).harvest(0)
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("0"))
    })

    it("should distribute rewards according to the alloc point", async () => {
      await stakingTokens[0].connect(admin).mint(alice.address, ethers.utils.parseEther("2000"))
      await stakingTokens[0].connect(alice).approve(stack.minerReward.address, ethers.utils.parseEther("2000"))

      await stakingTokens[1].connect(admin).mint(bob.address, ethers.utils.parseEther("2000"))
      await stakingTokens[1].connect(bob).approve(stack.minerReward.address, ethers.utils.parseEther("2000"))

      await stack.minerReward.connect(admin).addPool(1, stakingTokens[0].address, stack.linearRelease.address, 0)
      await stack.minerReward.connect(admin).addPool(4, stakingTokens[1].address, stack.linearRelease.address, 0)

      await stack.minerReward.connect(alice).deposit(alice.address, 0, ethers.utils.parseEther("2000"))
      await stack.minerReward.connect(alice).harvest(0)

      await stack.minerReward.connect(bob).deposit(bob.address, 1, ethers.utils.parseEther("2000"))
      await stack.minerReward.connect(bob).harvest(1)

      // alice's balance: 100*(1/5) * 50% = 10
      // bob's balance: 100*(4/5) * 50% = 40
      console.log("alice balance: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address)))
      console.log("bob balance: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(bob.address)))

      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("10"))
      expect(await stack.platformToken.balanceOf(bob.address)).to.eq(ethers.utils.parseEther("40"))
    })

    it("deposit and should farm reward", async () => {
      await stack.minerReward.addPool(1, stoken0.address, stack.linearRelease.address, 0)

      await stack.minerReward.connect(alice).deposit(alice.address, 0, ethers.utils.parseEther("1000"))

      const poolInfo = await stack.minerReward.userInfo(0, alice.address)
      console.log("poolInfo amount: ", ethers.utils.formatEther(poolInfo.amount))
      expect(poolInfo.amount).to.eq(ethers.utils.parseEther("1000"))

      // / mine one block
      await stack.minerReward.connect(alice).massUpdatePools([0])
      const reward = await stack.minerReward.pendingReward(0, alice.address)
      console.log("pendingReward: ", ethers.utils.formatEther(reward))
      expect(reward).to.eq(ethers.utils.parseEther("100"))
    })

    it("should deposit and get pending reward and redeemable reward", async () => {
      await stack.minerReward.addPool(1, stoken0.address, stack.linearRelease.address, 0)
      await stack.minerReward.connect(alice).deposit(alice.address, 0, ethers.utils.parseEther("1000"))
      await stack.minerReward.connect(alice).massUpdatePools([0])
      // pending reward 100
      console.log(
        "pending reward1: ",
        ethers.utils.formatEther(await stack.minerReward.connect(alice).totalPendingReward(0, alice.address))
      )
      expect(await stack.minerReward.connect(alice).totalPendingReward(0, alice.address)).to.eq(
        ethers.utils.parseEther("100")
      )

      // redeemable reward: 100 * 50% = 50
      console.log(
        "redeemable reward1: ",
        ethers.utils.formatEther(await stack.minerReward.connect(alice).redeemaleReward(0, alice.address))
      )
      expect(await stack.minerReward.connect(alice).redeemaleReward(0, alice.address)).to.eq(
        ethers.utils.parseEther("50")
      )

      //alice mined 2 blocks here, pending reward 200, harvest 100 immediately.
      await stack.minerReward.connect(alice).harvest(0)

      // pending reward 200 * 50% = 100
      console.log(
        "pending reward2: ",
        ethers.utils.formatEther(await stack.minerReward.connect(alice).totalPendingReward(0, alice.address))
      )
      expect(await stack.minerReward.connect(alice).totalPendingReward(0, alice.address)).to.eq(
        ethers.utils.parseEther("100")
      )
      // redeemable reward: 0. Locked 100.
      console.log(
        "redeemable reward2: ",
        ethers.utils.formatEther(await stack.minerReward.connect(alice).redeemaleReward(0, alice.address))
      )
      expect(await stack.minerReward.connect(alice).redeemaleReward(0, alice.address)).to.eq(
        ethers.utils.parseEther("0")
      )

      await stack.minerReward.connect(alice).massUpdatePools([0])

      // pending reward: 100(locked) + 100(mined) = 200
      console.log(
        "pending reward3: ",
        ethers.utils.formatEther(await stack.minerReward.connect(alice).totalPendingReward(0, alice.address))
      )
      expect(await stack.minerReward.connect(alice).totalPendingReward(0, alice.address)).to.eq(
        ethers.utils.parseEther("200")
      )
      // redeemable reward: 100 * 50% + 100*(1/10) = 60
      console.log(
        "redeemable reward3: ",
        ethers.utils.formatEther(await stack.minerReward.connect(alice).redeemaleReward(0, alice.address))
      )
      expect(await stack.minerReward.connect(alice).redeemaleReward(0, alice.address)).to.eq(
        ethers.utils.parseEther("60")
      )
    })

    it("deposit distrubte rewards to all farmers", async () => {
      await stack.minerReward.addPool(1, stoken0.address, stack.linearRelease.address, 0)

      await stack.minerReward.connect(alice).deposit(alice.address, 0, ethers.utils.parseEther("1000"))
      await stack.minerReward.connect(bob).deposit(bob.address, 0, ethers.utils.parseEther("1000"))

      expect((await stack.minerReward.userInfo(0, alice.address)).amount).to.eq(ethers.utils.parseEther("1000"))
      expect((await stack.minerReward.userInfo(0, bob.address)).amount).to.eq(ethers.utils.parseEther("1000"))
      // balance: 0
      // locked: 0
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("0"))
      expect(await stack.platformToken.balanceOf(bob.address)).to.eq(ethers.utils.parseEther("0"))

      await stack.minerReward.connect(alice).harvest(0)
      await stack.minerReward.connect(bob).harvest(0)

      // alice and bob both mined 2 blocks, alice minted one block ahead
      // In first block 100 minted to alice
      // alice's balance: 150 * 50% = 75
      // alice's locked reward: 75
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("75"))
      // bob's balance: 100 * 50% = 50
      // bob's locked reward: 50
      expect(await stack.platformToken.balanceOf(bob.address)).to.eq(ethers.utils.parseEther("50"))

      await stack.minerReward.connect(alice).harvest(0)
      await stack.minerReward.connect(bob).harvest(0)

      // alice and bob both mined 2 more blocks
      // alice's balance: 75 + (2/10) * 75 + 50 = 140
      // alice's locked reward: 75 * (8/10) + 50 = 110
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("140"))
      // bob's balance: 50 + (2/10) * 50 + 50 = 110
      // bob's locked reward: (8/10) * 50 + 50 = 90
      expect(await stack.platformToken.balanceOf(bob.address)).to.eq(ethers.utils.parseEther("110"))
    })

    it("should farm reward and can harvest all", async () => {
      console.log(">>>>>>>>>should lock reward when claim<<<<<<<<<")

      await stack.minerReward.addPool(1, stoken0.address, stack.linearRelease.address, 0)

      await stack.minerReward.connect(alice).deposit(alice.address, 0, ethers.utils.parseEther("1000"))

      const poolInfo = await stack.minerReward.userInfo(0, alice.address)
      console.log("poolInfo amount: ", ethers.utils.formatEther(poolInfo.amount))
      expect(poolInfo.amount).to.eq(ethers.utils.parseEther("1000"))

      await stack.minerReward.connect(alice).harvest(0)

      const BSTBalance = await stack.platformToken.balanceOf(alice.address)
      console.log("BSTBalance: ", ethers.utils.formatEther(BSTBalance))

      // first block generates: 100, 50% in lock, balance: 50
      // locked reward: 50
      expect(BSTBalance).to.eq(ethers.utils.parseEther("50"))

      await stack.minerReward.connect(alice).harvest(0)
      // balance: 50 + (1/10) * 50 + 50 = 105
      // locked reward: (9/10) * 50 + 50 = 95
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("105"))

      // mine one block
      await stack.minerReward.connect(alice).harvest(0)
      console.log("BSTBalance: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address)))

      // balance: 105 + (1/10) * 95 + 50 = 164.5
      // locked reward: (9/10) * 95 + 50 = 135.5
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("164.5"))

      await mineBlock(ethers.provider)
      await mineBlock(ethers.provider)
      await mineBlock(ethers.provider)
      await stack.minerReward.connect(alice).harvest(0)
      console.log("BSTBalance: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address)))
      // balance: 164.5 + (4/10) * 135.5 + 50*4 = 418.7
      // locked reward: (6/10) * 135.5 + 50*4 = 281.3
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("418.7"))

      await stack.minerReward.connect(alice).deposit(alice.address, 0, ethers.utils.parseEther("1000"))
      console.log("BSTBalance: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address)))
      // balance: 418.7 + (1/10) * 281.3 + 50 = 496.83
      // locked reward: (9/10) * 281.3 + 50 = 303.17
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("496.83"))

      const poolInfo2 = await stack.minerReward.userInfo(0, alice.address)
      console.log("poolInfo2 amount: ", ethers.utils.formatEther(poolInfo2.amount))
      expect(poolInfo2.amount).to.eq(ethers.utils.parseEther("2000"))

      console.log("pendingReward: ", ethers.utils.formatEther(await stack.minerReward.pendingReward(0, alice.address)))

      await stack.minerReward.connect(alice).withdraw(alice.address, 0, ethers.utils.parseEther("2000"))
      console.log("BSTBalance: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address)))
      // balance: 496.83 + (1/10) * 303.17 + 50 = 577.147
      // locked reward: (9/10) * 303.17 + 50 = 322.853
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("577.147"))

      await stack.minerReward.connect(alice).harvest(0)
      console.log("BSTBalance: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address)))
      // balance: 577.147 + (1/10) * 322.853 = 609.4323
      // locked reward: (9/10) * 322.853  = (9/10) * 322.853
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("609.4323"))

      await passBlocks(10)
      // mine 10 blocks to release all the reward in locker
      await stack.minerReward.connect(alice).harvest(0)
      console.log("BSTBalance: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address)))
      // balance: 609.4323 + (9/10) * 322.853 = 900
      // locked reward: 0
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("900"))

      await stack.minerReward.connect(alice).harvest(0)
      console.log("BSTBalance: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address)))
      // balance: 609.4323 + (9/10) * 322.853 = 900
      // locked reward: 0
      expect(await stack.platformToken.balanceOf(alice.address)).to.eq(ethers.utils.parseEther("900"))
    })

    it("should reward mint with locked platform token", async () => {
      await stack.platformToken.connect(admin).transfer(alice.address, ethers.utils.parseEther("1000"))
      console.log("balance before mint: ", ethers.utils.formatEther(await stack.platformToken.balanceOf(alice.address)))

      // add pools for staking tokens
      // 30% reward for mint locked
      await stack.minerReward.addPool(1, stack.platformToken.address, stack.linearRelease.address, 0)
      await stack.minerReward.addPool(3, stack.platformToken.address, stack.linearRelease.address, 0)
      await stack.platformToken.connect(alice).approve(stack.minerReward.address, uint256Max)

      console.log("Set BTC price to $100")
      await stack.prices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("BTC"), // currencyKey
        expandTo18Decimals(100) // price
      )
      // Mint 1,000,000 BTC to Alice
      await stack.btcToken.connect(admin).mint(alice.address, expandTo18Decimals(1_000_000))
      await stack.btcToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)
      await stack.platformToken.connect(alice).approve(stack.collateralSystem.address, uint256Max)
      // Alice can stake BTC with locked BST. 500 BST is staked to the first pool.
      await expect(
        stack.collateralSystem.connect(alice).stakeAndBuild(
          ethers.utils.formatBytes32String("BTC"), // stakeCurrency
          expandTo18Decimals(100), // stakeAmount
          expandTo18Decimals(1000), // buildAmount
          expandTo18Decimals(500) // locked amount
        )
      )
        .to.emit(stack.collateralSystem, "CollateralLog")
        .and.emit(stack.debtSystem, "PushDebtLog")

      // stake other 500 BST to the second pool.
      await stack.minerReward.connect(alice).deposit(alice.address, 1, ethers.utils.parseEther("500"))

      const reward0 = await stack.minerReward.connect(alice).totalPendingReward(0, alice.address)
      const reward1 = await stack.minerReward.connect(alice).totalPendingReward(1, alice.address)
      // staked 1 block, reward0: 100 * 1/(1+3) = 25
      // staked 0 block, reward0: 0
      expect(reward0).to.be.eq(ethers.utils.parseEther("25"))
      expect(reward1).to.be.eq(ethers.utils.parseEther("0"))

      await passBlocks(1)

      const reward01 = await stack.minerReward.connect(alice).totalPendingReward(0, alice.address)
      const reward11 = await stack.minerReward.connect(alice).totalPendingReward(1, alice.address)
      // staked 2 blocks, reward0: 100 * 1/(1+3)*2 = 50
      // staked 1 block, reward0: 100 * 3/(1+3)*1 = 75
      expect(reward01).to.be.eq(ethers.utils.parseEther("50"))
      expect(reward11).to.be.eq(ethers.utils.parseEther("75"))

      await stack.minerReward.connect(alice).harvest(0) // harevst 25
      await stack.minerReward.connect(alice).harvest(1) // harvest 75

      const balance1 = await stack.platformToken.balanceOf(alice.address)
      console.log("balance after mint and harvest: ", ethers.utils.formatEther(balance1))
      // reward of pool0: 25 * 3 = 75, reward of pool1: 75*3 = 225
      //  balance: 75/2 + 225/2 = 150
      expect(balance1).to.eq(ethers.utils.parseEther("150"))

      // Alice burn and unstake all.
      await expect(
        stack.collateralSystem.connect(alice).burnAndUnstakeMax(
          expandTo18Decimals(1000), // stakeAmount
          ethers.utils.formatBytes32String("BTC") // stakeCurrency
        )
      )
        .to.emit(stack.debtSystem, "PushDebtLog")
        .and.emit(stack.collateralSystem, "RedeemCollateral")

      const balance2 = await stack.platformToken.balanceOf(alice.address)
      console.log("balance after burn and unstake: ", ethers.utils.formatEther(balance2))
      expect(balance2).to.eq(ethers.utils.parseEther("682.5"))
      // passed 2 blocks, redeemable rewards: 25*2 * 0.5 + 37.5*(2/10) = 32.5
      // balance: 32.5 + 150 + 500 = 682.5
    })
  })
})
