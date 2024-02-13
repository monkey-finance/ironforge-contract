import { Duration } from "luxon"
import { expandTo18Decimals } from "../../../test/utilities"
import { formatBytes32String } from "ethers/lib/utils"
import { ethers } from "ethers"

export const settings = {
  buildTokens: [
    {
      name: "btcToken",
      key: "BTC",
      minCollateral: ethers.utils.parseEther("0.00001"),
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
    ORACLE_SERVER_ROLE_KEY: "ORACLE_SERVER",
    ORACLE_SERVER_ROLE_ADDRESS: "0xc6098dF5DE0608b98b75963D47386457F1C89DEe",
    ORACLE_TYPE_CHAINLINK: 1,
    ORACLE_TYPE_QUARTERLY_CONTRACT: 2,
    ORACLE_TYPE_DEX: 3,
    quarterlyContracts: {
      lBTCUSD_210924: {
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
      lBTCUSD_211231: {
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
    },
    dexOracles: {
      BST: {
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
    },
    chainLinkOracles: {
      USDC: {
        aggregatorAddress: "0x90c069C4538adAc136E051052E14c1cD799C41B7",
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
      BTC: {
        aggregatorAddress: "0x5741306c21795FdCBb9b265Ea0255F499DFe515C",
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
      lBTC: {
        aggregatorAddress: "0x5741306c21795FdCBb9b265Ea0255F499DFe515C",
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
      ETH: {
        aggregatorAddress: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
      lETH: {
        aggregatorAddress: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
    },
  },
  synths: [
    {
      key: "lBTCUSD_210924",
      value: expandTo18Decimals(0.01), // exchange fee
    },
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
      value: Duration.fromObject({ seconds: 65 }).as("seconds"),
    },
    {
      key: "TradeRevertDelay",
      value: Duration.fromObject({ minutes: 125 }).as("seconds"),
    },
  ],
  checkChainLinkDesc: false,
}
