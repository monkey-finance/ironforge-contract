import { Duration } from "luxon"
import { expandTo18Decimals } from "../../utilities"
import { ethers } from "ethers"

export const settings = {
  buildTokens: [
    {
      name: "platformToken",
      key: "BST",
      minCollateral: ethers.utils.parseEther("1"),
      address: "",
      close: false,
      buildRatio: expandTo18Decimals(0.2),
    },
    {
      name: "btcToken",
      key: "BTC",
      minCollateral: ethers.utils.parseEther("0.00001"),
      address: "",
      close: false,
      buildRatio: expandTo18Decimals(0.2),
    },
    {
      name: "usdtToken",
      key: "USDT",
      minCollateral: ethers.utils.parseEther("1"),
      address: "",
      close: false,
      buildRatio: expandTo18Decimals(0.2),
    },
    {
      name: "usdcToken",
      key: "USDC",
      minCollateral: ethers.utils.parseEther("1"),
      address: "",
      close: false,
      buildRatio: expandTo18Decimals(0.2),
    },
    {
      name: "ethToken",
      key: "ETH",
      minCollateral: ethers.utils.parseEther("0.0001"),
      address: "",
      close: false,
      buildRatio: expandTo18Decimals(0.2),
    },
  ],
  oracle: {
    ORACLE_TYPE_CHAINLINK: 1,
    ORACLE_TYPE_QUARTERLY_CONTRACT: 2,
    ORACLE_TYPE_DEX: 3,
    dexOracles: {
      BST: {
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
    },
  },
  synths: [
    {
      key: "lBTCUSD_211231",
      value: expandTo18Decimals(0.01), // exchange fee
    },
    {
      key: "lBTC",
      value: expandTo18Decimals(0.01), // exchange fee
    },
    {
      key: "lETH",
      value: expandTo18Decimals(0.01), // exchange fee
    },
    {
      key: "FUSD",
      value: expandTo18Decimals(0.01), // exchange fee
    },
  ],
  config: [
    {
      key: "DeviationExchange",
      value: expandTo18Decimals(0.03),
    },
    {
      key: "LiquidationRatio",
      value: expandTo18Decimals(0.5),
    },
    {
      key: "LiquidationMarkerReward",
      value: expandTo18Decimals(0.05),
    },
    {
      key: "LiquidationLiquidatorReward",
      value: expandTo18Decimals(0.1),
    },
    {
      key: "LiquidationDelay",
      value: Duration.fromObject({ days: 3 }).as("seconds"),
    },
    {
      key: "TradeSettlementDelay",
      value: Duration.fromObject({ seconds: 6 }).as("seconds"),
    },
    {
      key: "TradeRevertDelay",
      value: Duration.fromObject({ minutes: 1 }).as("seconds"),
    },
  ],
  checkChainLinkDesc: false,
}
