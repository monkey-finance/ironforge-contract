import { ethers, upgrades, waffle } from "hardhat"
import { expect, use } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { IronForgeToken } from "../typechain"

const { formatBytes32String } = ethers.utils

use(waffle.solidity)

// @ts-ignore
describe("IronForgeToken", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    rewarder: SignerWithAddress,
    rewardLocker: SignerWithAddress

  let platformToken: IronForgeToken

  beforeEach(async function () {
    ;[deployer, admin, alice, rewarder, rewardLocker] = await ethers.getSigners()

    const IronForgeTokenFactory = await ethers.getContractFactory("IronForgeToken")

    platformToken = (await upgrades.deployProxy(IronForgeTokenFactory, {
      initializer: "initialize",
    })) as IronForgeToken
  })

  it("should get symbol", async function () {
    const symbol = await platformToken.symbol()
    console.log(symbol)
    expect(await platformToken.symbolBytes32()).to.be.eq(formatBytes32String(symbol))
  })
})
