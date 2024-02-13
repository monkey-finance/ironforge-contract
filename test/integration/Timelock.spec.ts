import { ethers } from "hardhat"
import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { expandTo18Decimals, uint256Max } from "../utilities"
import { CollateralSystem, Config, IronForgeToken, MinerReward, Timelock } from "../../typechain"
import { deployWithMockPrice } from "../../scripts/testnet/localhost/deployWithMockPrice"
import { DeployedStackResult } from "../../scripts/testnet/deployParamTypes"
import * as TimeHelpers from "../utilities/timeTravel"

describe("Integration | TimeLock", function () {
  let deployer: SignerWithAddress, admin: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress

  let stack: DeployedStackResult
  let config: Config
  let timelockAsAdmin: Timelock
  let minerReward: MinerReward
  let minerRewardAsAlice: MinerReward

  beforeEach(async function () {
    ;[deployer, alice, bob] = await ethers.getSigners()
    admin = deployer
    this.timeout(30000)

    console.log("deployContractsStack")
    stack = await deployWithMockPrice(deployer, admin)
    config = stack.config
    timelockAsAdmin = stack.timelock.connect(admin)
    minerReward = stack.minerReward
    await config.transferOwnership(timelockAsAdmin.address)
    await minerReward.transferOwnership(timelockAsAdmin.address)
    minerRewardAsAlice = stack.minerReward.connect(alice)
  })
  context("when non-owner try to adjust params", async () => {
    it("should not allow to do so on MinerReward contract", async () => {
      // Check all functions that can adjust params in FairLaunch contract
      await expect(minerReward.transferOwnership(await bob.getAddress())).to.be.revertedWith(
        "Ownable: caller is not the owner"
      )
      await expect(
        minerRewardAsAlice.addPool(1, stack.platformToken.address, stack.linearRelease.address, 0)
      ).to.be.revertedWith("Ownable: caller is not the owner")
      await expect(minerRewardAsAlice.setPool(1, 1, stack.linearRelease.address, true)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      )
    })

    it("should not allow to do so on Config contract", async () => {
      // Check all functions that can adjust params in FairLaunch contract
      await expect(minerReward.transferOwnership(await bob.getAddress())).to.be.revertedWith(
        "Ownable: caller is not the owner"
      )
      await expect(
        minerRewardAsAlice.addPool(1, stack.platformToken.address, stack.linearRelease.address, 0)
      ).to.be.revertedWith("Ownable: caller is not the owner")
      await expect(minerRewardAsAlice.setPool(1, 1, stack.linearRelease.address, true)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      )
    })
  })

  context("when timelock adjust params", async () => {
    it("should setBonus in minerReward contract", async () => {
      const eta = (await TimeHelpers.latest()).add(TimeHelpers.duration.days(ethers.BigNumber.from("4")))
      await timelockAsAdmin.queueTransaction(
        minerReward.address,
        "0",
        "addPool(uint256,address,address,uint256)",
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address", "address", "uint256"],
          [1, stack.lbtcToken.address, stack.linearRelease.address, 0]
        ),
        eta
      )

      await TimeHelpers.increase(TimeHelpers.duration.days(ethers.BigNumber.from("1")))

      await expect(
        timelockAsAdmin.executeTransaction(
          minerReward.address,
          "0",
          "addPool(uint256,address,address,uint256)",
          ethers.utils.defaultAbiCoder.encode(
            ["uint256", "address", "address", "uint256"],
            [1, stack.lbtcToken.address, stack.linearRelease.address, 0]
          ),
          eta
        )
      ).to.be.revertedWith("Timelock::executeTransaction: Transaction hasn't surpassed time lock.")

      await TimeHelpers.increase(TimeHelpers.duration.days(ethers.BigNumber.from("4")))

      await timelockAsAdmin.executeTransaction(
        minerReward.address,
        "0",
        "addPool(uint256,address,address,uint256)",
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address", "address", "uint256"],
          [1, stack.lbtcToken.address, stack.linearRelease.address, 0]
        ),
        eta
      )
      const [amount, stakeToken, allocPoint, ,] = await minerReward.poolInfo(0)
      expect(allocPoint.toNumber()).to.be.eq(1)
      expect(stakeToken).to.be.eq(stack.lbtcToken.address)
    })
  })
})
