import { ethers, upgrades, waffle } from "hardhat"
import { expect, use } from "chai"
import { BigNumber, Contract } from "ethers"
import { formatBytes32String } from "ethers/lib/utils"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { expandTo18Decimals, expandToNDecimals } from "./utilities"
import { AccessControl, AssetSystem, OracleRouter, QuarterlyContractOracle } from "../typechain"
import { settings } from "../scripts/testnet/common/settings"

use(waffle.solidity)

describe("OracleRouter", function () {
  let deployer: SignerWithAddress, admin: SignerWithAddress, oracleServer: SignerWithAddress

  let oracleRouter: OracleRouter, chainlinkAggregator: Contract
  let quarterlyContractOracle: QuarterlyContractOracle
  const assertPriceAndUpdateTime = async (
    currency: string,
    price: number | BigNumber,
    upateTime: number | BigNumber
  ): Promise<void> => {
    const priceAndUpdateTime = await oracleRouter.getPriceAndUpdatedTime(
      formatBytes32String(currency) // currencyKey
    )
    expect(priceAndUpdateTime.price).to.equal(price)
    expect(priceAndUpdateTime.time).to.equal(upateTime)
  }

  beforeEach(async function () {
    ;[deployer, admin, oracleServer] = await ethers.getSigners()
    upgrades.silenceWarnings()

    const SafeDecimalMath = await ethers.getContractFactory("SafeDecimalMath")
    const safeDecimalMath = await SafeDecimalMath.deploy()

    const OracleRouterFactory = await ethers.getContractFactory("OracleRouter", {
      signer: deployer,
      libraries: {
        "contracts/libs/SafeDecimalMath.sol:SafeDecimalMath": safeDecimalMath.address,
      },
    })
    const MockChainlinkAggregator = await ethers.getContractFactory("MockChainlinkAggregator")

    oracleRouter = (await upgrades.deployProxy(
      OracleRouterFactory,
      [
        admin.address, // _admin
      ],
      {
        initializer: "initialize",
        unsafeAllowLinkedLibraries: true,
      }
    )) as OracleRouter
    chainlinkAggregator = await MockChainlinkAggregator.deploy()

    // Set token "LINK" to use Chainlink
    await oracleRouter.connect(admin).addChainlinkOracle(
      formatBytes32String("LINK"), // currencyKey
      chainlinkAggregator.address, // oracleAddress
      false // removeExisting
    )

    const QuarterlyContractOracleFactory = await ethers.getContractFactory("QuarterlyContractOracle", {
      signer: deployer,
    })
    quarterlyContractOracle = (await upgrades.deployProxy(
      QuarterlyContractOracleFactory,
      [
        admin.address, // _admin
      ],
      {
        initializer: "initialize",
        unsafeAllowLinkedLibraries: true,
      }
    )) as QuarterlyContractOracle

    await oracleRouter.connect(admin).addQuarterlyContractOracle(
      formatBytes32String("BTCUSD_210924"), // currencyKey
      quarterlyContractOracle.address, // oracleAddress
      false // removeExisting
    )
    await oracleRouter.connect(admin).addQuarterlyContractOracles(
      [formatBytes32String("BTCUSD_211231")], // currencyKey
      [quarterlyContractOracle.address], // oracleAddress
      false // removeExisting
    )

    const AccessControlFactory = await ethers.getContractFactory("AccessControl")
    const accessControl = (await AccessControlFactory.deploy()) as AccessControl
    await accessControl.connect(deployer).initialize(
      admin.address // admin
    )
    await accessControl.connect(admin).SetRoles(
      settings.ORACLE_SERVER_ROLE_KEY, // roleType
      [oracleServer.address], // addresses
      [true] // setTo
    )

    const AssetSystemFactory = await ethers.getContractFactory("AssetSystem")

    const assetSystem = (await AssetSystemFactory.deploy()) as AssetSystem
    await assetSystem.connect(deployer).initialize(admin.address)

    await assetSystem
      .connect(admin)
      .updateAll(
        [ethers.utils.formatBytes32String("AssetSystem"), ethers.utils.formatBytes32String("AccessControl")],
        [assetSystem.address, accessControl.address]
      )

    await quarterlyContractOracle.connect(admin).updateAddressCache(assetSystem.address)
  })
  it("should get quarterly contract price", async () => {
    await expect(
      quarterlyContractOracle
        .connect(admin)
        .setQuarterlyContractPrice(formatBytes32String("BTCUSD_210924"), "45500000000000000000000", 1629383480661)
    ).to.be.revertedWith("QuarterlyContractOracle: not ORACLE_SERVER role")

    await quarterlyContractOracle
      .connect(oracleServer)
      .setQuarterlyContractPrice(formatBytes32String("BTCUSD_210924"), "45500000000000000000000", 1629383480661)

    const data = await quarterlyContractOracle.getQuarterlyContractPrice(formatBytes32String("BTCUSD_210924"))
    expect(data.price).to.be.equal("45500000000000000000000")
    expect(data.updateTime).to.be.equal(1629383480661)
  })
  it("should get result in 18 decimals regardless of Chainlink aggregator precision", async () => {
    // 8 decimals
    await chainlinkAggregator.setDecimals(8)
    await chainlinkAggregator.setLatestRoundData(
      1, // newRoundId
      expandToNDecimals(10, 8), // newAnswer
      100, // newStartedAt
      200, // newUpdatedAt
      1 // newAnsweredInRound
    )
    await assertPriceAndUpdateTime("LINK", expandTo18Decimals(10), 200)

    // 18 decimals
    await chainlinkAggregator.setDecimals(18)
    await chainlinkAggregator.setLatestRoundData(
      1, // newRoundId
      expandToNDecimals(10, 18), // newAnswer
      100, // newStartedAt
      200, // newUpdatedAt
      1 // newAnsweredInRound
    )
    await assertPriceAndUpdateTime("LINK", expandTo18Decimals(10), 200)

    // 20 decimals
    await chainlinkAggregator.setDecimals(20)
    await chainlinkAggregator.setLatestRoundData(
      1, // newRoundId
      expandToNDecimals(10, 20), // newAnswer
      100, // newStartedAt
      200, // newUpdatedAt
      1 // newAnsweredInRound
    )
    await assertPriceAndUpdateTime("LINK", expandTo18Decimals(10), 200)
  })

  it("should not set price if frozen", async () => {
    const BTCUSD_2112 = formatBytes32String("BTCUSD_211231")
    const BTCUSD_2109 = formatBytes32String("BTCUSD_210924")

    await oracleRouter.connect(admin).setFrozen(BTCUSD_2112, true)
    await expect(
      quarterlyContractOracle
        .connect(oracleServer)
        .setQuarterlyContractPrice(BTCUSD_2112, "45500000000000000000000", 1629383480661)
    ).to.be.revertedWith("OracleRouter: price frozen")
    await oracleRouter.connect(admin).setFrozen(BTCUSD_2112, false)
    await expect(
      quarterlyContractOracle
        .connect(oracleServer)
        .setQuarterlyContractPrice(BTCUSD_2112, "45500000000000000000000", 1629383480661)
    )
      .to.emit(quarterlyContractOracle, "PriceUpdated")
      .withArgs(BTCUSD_2112, "45500000000000000000000", 1629383480661)
  })
})
