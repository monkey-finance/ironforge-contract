import { Duration } from "luxon"
import { expandTo18Decimals } from "../utilities"
import { formatBytes32String } from "ethers/lib/utils"
import { ethers } from "ethers"

export const QuarterlyContracts = [
  {
    symbol: "lBTCUSD_210924",
    rate: expandTo18Decimals(0.01),
    stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
  },
  {
    symbol: "lBTCUSD_211231",
    rate: expandTo18Decimals(0.01),
    stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
  },
]

export const settings = {
  mainnet: {
    // mainnet
    PancakeFactoryContract: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    PancakeRouterContract: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    usdcToken: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    btcToken: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
    ethToken: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    usdtToken: "0x55d398326f99059ff775485246999027b3197955",
  },
  testnet: {
    PancakeFactoryContract: "0x317505041A8ac9eEd4d2D8037F0d432D989a06F8",
    PancakeRouterContract: "0x694CE6d875CaE2b468ee29CdFD969af501B43643",
    usdcToken: "0xFd9a847dD5e37e40DAa573a32fe43058f5018ad1",
    btcToken: "0x6a17E72bEfa58b883EE4BE22f05e946234930d3c",
    ethToken: "0xe1fbD1B9d9252dE65725847f0dca072d20e62B40",
    usdtToken: "0x13aCC9866559202638Ef1D99A190F37a6bC7D45d",
  },

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
      ...QuarterlyContracts.reduce((res, item) => {
        res[item.symbol] = { stalePeriod: item.stalePeriod }
        return res
      }, {} as Record<string, any>),
      // lBTCUSD_210924: {
      //   stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      // },
      // lBTCUSD_211231: {
      //   stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      // },
    },
    dexOracles: {
      BST: {
        stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
      },
    },
    // mainnet
    // chainLinkOracles: {
    //   USDC: {
    //     aggregatorAddress: "0x51597f405303C4377E36123cBc172b13269EA163",
    //     stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
    //   },
    //   BTC: {
    //     aggregatorAddress: "0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf",
    //     stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
    //   },
    //   lBTC: {
    //     aggregatorAddress: "0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf",
    //     stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
    //   },
    //   ETH: {
    //     aggregatorAddress: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
    //     stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
    //   },
    //   lETH: {
    //     aggregatorAddress: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
    //     stalePeriod: Duration.fromObject({ hours: 24 }).as("seconds"),
    //   },
    // },
    //TODO testnet
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
    ...QuarterlyContracts.map((item) => ({ key: item.symbol, value: item.rate })),
    // {
    //   key: "lBTCUSD_210924",
    //   value: expandTo18Decimals(0.01), // exchange fee
    // },
    // {
    //   key: "lBTCUSD_211231",
    //   value: expandTo18Decimals(0.01), // exchange fee
    // },
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
