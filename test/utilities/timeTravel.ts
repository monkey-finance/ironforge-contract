import { BigNumber, providers } from "ethers"
import { DateTime } from "luxon"
import { ethers } from "hardhat"
/**
 * To have complete control over block time, we need to stop automatic mining,
 * and mine every single block manually.
 * @param provider JSON RPC provider
 */
export function setNextBlockTimestamp(
  provider: providers.JsonRpcProvider,
  timestamp: number | DateTime
): Promise<void> {
  return provider.send("evm_setNextBlockTimestamp", [typeof timestamp === "number" ? timestamp : timestamp.toSeconds()])
}

/**
 * Mine a block with a specific timestamp. This is helpful when performing time-dependent
 * contract reads.
 * @param provider JSON RPC provider
 * @param timestamp Unix timestamp in seconds
 */
export function mineBlock(provider: providers.JsonRpcProvider, timestamp?: number | DateTime): Promise<void> {
  return provider.send("evm_mine", timestamp ? [typeof timestamp === "number" ? timestamp : timestamp.toSeconds()] : [])
}

/**
 * Get the timestamp of the latest block.
 * @param provider JSON RPC provider
 */
export async function getBlockDateTime(provider: providers.JsonRpcProvider): Promise<DateTime> {
  const lastestBlock = provider.getBlock("latest")
  return DateTime.fromSeconds((await lastestBlock).timestamp)
}

export async function latest(): Promise<BigNumber> {
  const block = await ethers.provider.getBlock("latest")
  return ethers.BigNumber.from(block.timestamp)
}

export const duration = {
  seconds: function (val: BigNumber): BigNumber {
    return val
  },
  minutes: function (val: BigNumber): BigNumber {
    return val.mul(this.seconds(ethers.BigNumber.from("60")))
  },
  hours: function (val: BigNumber): BigNumber {
    return val.mul(this.minutes(ethers.BigNumber.from("60")))
  },
  days: function (val: BigNumber): BigNumber {
    return val.mul(this.hours(ethers.BigNumber.from("24")))
  },
  weeks: function (val: BigNumber): BigNumber {
    return val.mul(this.days(ethers.BigNumber.from("7")))
  },
  years: function (val: BigNumber): BigNumber {
    return val.mul(this.days(ethers.BigNumber.from("365")))
  },
}
export async function advanceBlockTo(block: number) {
  let latestBlock = (await latestBlockNumber()).toNumber()

  if (block <= latestBlock) {
    throw new Error("input block exceeds current block")
  }

  while (block > latestBlock) {
    await advanceBlock()
    latestBlock++
  }
}

export async function latestBlockNumber(): Promise<BigNumber> {
  const block = await ethers.provider.getBlock("latest")
  return ethers.BigNumber.from(block.number)
}

export async function advanceBlock() {
  await ethers.provider.send("evm_mine", [])
}

export async function increase(duration: BigNumber) {
  if (duration.isNegative()) throw Error(`Cannot increase time by a negative amount (${duration})`)

  await ethers.provider.send("evm_increaseTime", [duration.toNumber()])

  await advanceBlock()
}
