import { expandTo18Decimals, uint256Max, zeroAddress } from "./utilities"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { PublicCatalystMath } from "../typechain"

describe("calc", function () {
  it("expandTo18Decimals", async () => {
    expect(expandTo18Decimals(10.123456789123456789123456789)).to.eq(BigNumber.from("10123456789123457000"))
    expect(expandTo18Decimals("10.123456789123456789123456789")).to.eq(BigNumber.from("10123456789123456789"))
  })

  it("Catalyst Math", async () => {
    let deployer: SignerWithAddress
    ;[deployer] = await ethers.getSigners()
    const CatalystMath = await ethers.getContractFactory("CatalystMath", deployer)
    const catalystMath = await CatalystMath.deploy()

    const fatory = await ethers.getContractFactory("PublicCatalystMath", {
      signer: deployer,
      libraries: {
        "contracts/libs/CatalystMath.sol:CatalystMath": catalystMath.address,
      },
    })
    const publicCatalystMath = (await fatory.deploy()) as PublicCatalystMath

    async function test(proportion: string, catalyst: string) {
      const logRet = await publicCatalystMath.connect(deployer).calcCatalyst(ethers.utils.parseEther(proportion))
      console.log(`proportion: ${proportion}, catalyst: ${ethers.utils.formatEther(logRet)}`)
      expect(ethers.utils.formatEther(logRet)).to.eq(catalyst)
    }

    await test("1", "0.1")
    await test("2", "0.1")
    await test("1000", "0.1")
    await test("0.6", "0.089051846931056591")
    await test("0.763", "0.094193571764962462")
    await test("0.38", "0.079340613472168795")
    const logRet = await publicCatalystMath.connect(deployer).calcCatalyst(uint256Max)
    console.log(`proportion: ${uint256Max}, catalyst: ${ethers.utils.formatEther(logRet)}`)
    expect(ethers.utils.formatEther(logRet)).to.eq("0.1")
  })
})
