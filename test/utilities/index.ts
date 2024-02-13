import {BigNumber as B} from "bignumber.js"
import { BigNumber } from "ethers";

export const zeroAddress: string = "0x0000000000000000000000000000000000000000";
export const uint256Max: string =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export function expandTo18Decimals(num: number|string): BigNumber {
  return expandToNDecimals(num, 18);
}

export function expandToNDecimals(num: number|string, n: number): BigNumber {
  const bigNum = new B(num)
  const ret = bigNum.shiftedBy(n).toFixed(0, B.ROUND_DOWN)
  return BigNumber.from(ret.toString());
}
