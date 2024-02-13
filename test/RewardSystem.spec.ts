import { ethers, waffle } from "hardhat"
import { expect, use } from "chai"
import { BigNumber, Contract, Wallet } from "ethers"
import { MockContract } from "ethereum-waffle"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { DateTime, Duration } from "luxon"
import { expandTo18Decimals } from "./utilities"
import { getBlockDateTime, setNextBlockTimestamp } from "./utilities/timeTravel"

import ICollateralSystem from "../artifacts/contracts/interfaces/ICollateralSystem.sol/ICollateralSystem.json"

use(waffle.solidity)

describe("RewardSystem", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    rewardSigner: Wallet

  let fusd: Contract,
    CollateralSystem: MockContract,
    RewardLocker: Contract,
    RewardSystem: Contract

  let aliceSignaturePeriod1: string

  let firstPeriodStartTime: DateTime
  const periodDuration: Duration = Duration.fromObject({ weeks: 1 })
  const stakingRewardLockTime: Duration = Duration.fromObject({ weeks: 52 })

  const getPeriodEndTime = (periodId: number): DateTime => {
    let endTime = firstPeriodStartTime
    for (let ind = 0; ind < periodId; ind++) {
      endTime = endTime.plus(periodDuration)
    }
    return endTime
  }

  const createSignature = async (
    signer: Wallet,
    periodId: BigNumber,
    recipient: string,
    feeReward: BigNumber
  ): Promise<string> => {
    const domain = {
      name: "IronForge",
      version: "1",
      chainId: (await ethers.provider.getNetwork()).chainId,
      verifyingContract: RewardSystem.address,
    }

    const types = {
      Reward: [
        { name: "periodId", type: "uint256" },
        { name: "recipient", type: "address" },
        { name: "feeReward", type: "uint256" },
      ],
    }

    const value = {
      periodId,
      recipient,
      feeReward,
    }

    const signatureHex = await signer._signTypedData(domain, types, value)

    return signatureHex
  }

  beforeEach(async function () {
    ;[deployer, admin, alice, bob] = await ethers.getSigners()
    rewardSigner = Wallet.createRandom()

    const MockERC20 = await ethers.getContractFactory("MockERC20")

    const RewardSystemFactory = await ethers.getContractFactory("RewardSystem")

    firstPeriodStartTime = (await getBlockDateTime(ethers.provider)).plus({
      days: 1,
    })

    fusd = await MockERC20.deploy(
      "FUSD", // _name
      "FUSD" // _symbol
    )

    CollateralSystem = await waffle.deployMockContract(
      deployer,
      ICollateralSystem.abi
    )
    await CollateralSystem.mock.IsSatisfyTargetRatio.returns(true)

    RewardSystem = await RewardSystemFactory.deploy()
    await RewardSystem.connect(deployer).initialize(
      firstPeriodStartTime.toSeconds(), // _firstPeriodStartTime
      rewardSigner.address, // _rewardSigner
      fusd.address, // _fusdAddress
      CollateralSystem.address, // _collateralSystemAddress
      admin.address // _admin
    )

    // RewardSystem holds 1,000,000 FUSD to start
    await fusd
      .connect(deployer)
      .mint(RewardSystem.address, expandTo18Decimals(1_000_000))

    // Period 1, 100 staking reward, 100 fee reward
    aliceSignaturePeriod1 = await createSignature(
      rewardSigner,
      BigNumber.from(1),
      alice.address,
      expandTo18Decimals(200)
    )
  })

  it("only admin can change signer", async () => {
    expect(await RewardSystem.rewardSigner()).to.equal(rewardSigner.address)

    await expect(
      RewardSystem.connect(alice).setRewardSigner(alice.address)
    ).to.revertedWith(
      "AdminUpgradeable: only the contract admin can perform this action"
    )

    await RewardSystem.connect(admin).setRewardSigner(alice.address)

    expect(await RewardSystem.rewardSigner()).to.equal(alice.address)
  }).timeout(50000)

  it("can claim reward with valid signature", async () => {
    await setNextBlockTimestamp(ethers.provider, getPeriodEndTime(1))

    await expect(
      RewardSystem.connect(alice).claimReward(
        1,
        expandTo18Decimals(200),
        aliceSignaturePeriod1
      )
    )
      .to.emit(RewardSystem, "RewardClaimed")
      .withArgs(
        alice.address, // recipient
        1,
        expandTo18Decimals(200)
      )
      .to.emit(fusd, "Transfer")
      .withArgs(RewardSystem.address, alice.address, expandTo18Decimals(200))

    // Assert fee reward
    expect(await fusd.balanceOf(RewardSystem.address)).to.equal(
      expandTo18Decimals(999_800)
    )
    expect(await fusd.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(200)
    )
  }).timeout(50000)

  it("cannot claim reward with invalid signature", async () => {
    const fakeSigner = Wallet.createRandom()
    const fakeSignature = await createSignature(
      fakeSigner,
      BigNumber.from(1),
      alice.address,
      expandTo18Decimals(200)
    )

    await setNextBlockTimestamp(ethers.provider, getPeriodEndTime(2))

    console.log("xxxxx-1 Wrong period id")
    // Wrong period id
    await expect(
      RewardSystem.connect(alice).claimReward(
        2,
        expandTo18Decimals(200),
        aliceSignaturePeriod1
      )
    ).to.revertedWith("RewardSystem: invalid signature")

    console.log("xxxxx-3 Wrong fee reward")
    // Wrong fee reward
    await expect(
      RewardSystem.connect(alice).claimReward(
        1,
        expandTo18Decimals(300),
        aliceSignaturePeriod1
      )
    ).to.revertedWith("RewardSystem: invalid signature")

    console.log("xxxxx-4  Wrong signer")

    // Wrong signer
    await expect(
      RewardSystem.connect(alice).claimReward(
        1,
        expandTo18Decimals(200),
        fakeSignature
      )
    ).to.revertedWith("RewardSystem: invalid signature")
  }).timeout(50000)

  it("cannot claim reward before period ends", async () => {
    await setNextBlockTimestamp(
      ethers.provider,
      getPeriodEndTime(1).minus({ seconds: 1 })
    )

    await expect(
      RewardSystem.connect(alice).claimReward(
        1,
        expandTo18Decimals(200),
        aliceSignaturePeriod1
      )
    ).to.revertedWith("RewardSystem: period not ended")
  }).timeout(50000)

  it("cannot claim reward multiple times", async () => {
    await setNextBlockTimestamp(ethers.provider, getPeriodEndTime(1))

    await RewardSystem.connect(alice).claimReward(
      1,
      expandTo18Decimals(200),
      aliceSignaturePeriod1
    )

    await expect(
      RewardSystem.connect(alice).claimReward(
        1,
        expandTo18Decimals(200),
        aliceSignaturePeriod1
      )
    ).to.revertedWith("RewardSystem: reward already claimed")
  }).timeout(50000)
})
