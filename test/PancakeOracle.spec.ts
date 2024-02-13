import { ethers, waffle } from "hardhat"
import { expect, use } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { MockPrices, OracleRouter, PancakeOracle } from "../typechain"
import { getBlockDateTime, mineBlock } from "./utilities/timeTravel"
import { deployWithOracle } from "../scripts/testnet/bsc/deployWithOracle"

use(waffle.solidity)

describe("PancakeOracle", function () {
  let deployer: SignerWithAddress, admin: SignerWithAddress, oracleServer: SignerWithAddress

  let oracleRouter: OracleRouter, platformTokenDexOracle: PancakeOracle
  beforeEach(async function () {
    ;[deployer, admin, oracleServer] = await ethers.getSigners()
    const ret = await deployWithOracle()
    oracleRouter = <OracleRouter>ret.prices
    platformTokenDexOracle = <PancakeOracle>ret.platformTokenDexOracle
  })

  it("expect platformToken TWAP price is 0", async () => {
    const price = await oracleRouter.getPrice(ethers.utils.formatBytes32String("BST"))
    expect(price).to.be.equal(0)
  })

  it.only("should get platformToken TWAP price from oracle router", async () => {
    const startTime = await getBlockDateTime(ethers.provider)
    await mineBlock(ethers.provider, startTime.plus({ days: 1, seconds: 10 }))
    await platformTokenDexOracle.update()
    const price = await oracleRouter.getPrice(ethers.utils.formatBytes32String("BST"))
    // price = 0.1
    console.log(`price : ${price.toString()}`)
    expect(price).to.be.gt(0)

    await mineBlock(ethers.provider, startTime.plus({ days: 2, seconds: 10 }))
    await platformTokenDexOracle.update()
    const price1 = await oracleRouter.getPrice(ethers.utils.formatBytes32String("BST"))
    console.log(`price1 : ${price1.toString()}`)
    expect(price).to.be.eq(price1)
  })
})
