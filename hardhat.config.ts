import { config as dotEnvConfig } from "dotenv"
import { logger } from "./scripts/utilities/log"

import path from "path"
const pathOfEnv = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
logger.debug(`pathOfEnv: ${pathOfEnv}`)
dotEnvConfig({ path: pathOfEnv })
if (process.env.NODE_ENV === "localhost") {
  process.env.HARDHAT_NETWORK = "localhost"
} else if (process.env.NODE_ENV === "test") {
  process.env.HARDHAT_NETWORK = "bsc-testnet"
} else if (process.env.NODE_ENV === "prod") {
  process.env.HARDHAT_NETWORK = "bsc-mainnet"
} else if (process.env.NODE_ENV === "hardhat") {
  process.env.HARDHAT_NETWORK = "hardhat"
}

import "@openzeppelin/hardhat-upgrades"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-solhint"
import "@nomiclabs/hardhat-waffle"
import "hardhat-abi-exporter"
import "hardhat-deploy"
import "hardhat-deploy-ethers"
import "hardhat-gas-reporter"
import "hardhat-spdx-license-identifier"
import "hardhat-typechain"
import "solidity-coverage"
import "hardhat-watcher"
import "hardhat-tracer"
import { HardhatUserConfig } from "hardhat/types"
import { removeConsoleLog } from "hardhat-preprocessor"
import { ethers } from "ethers"
import { extendEnvironment } from "hardhat/config"
import "./tasks"

const accounts = {
  mnemonic: "test test test test test test test test test test test junk",
  accountsBalance: ethers.utils.parseEther("10000000000").toString(),
}
let config: HardhatUserConfig = {
  abiExporter: {
    path: "./abi",
    clear: false,
    flat: true,
    // only: [],
    // except: []
  },
  defaultNetwork: process.env.HARDHAT_NETWORK,
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: "USD",
    enabled: process.env.REPORT_GAS === "true",
    excludeContracts: ["contracts/5/mocks/", "contracts/5/libs/"],
  },
  networks: {
    localhost: {
      chainId: 1337,
      url: "http://localhost:8545",
      accounts: accounts,
    },
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      accounts: accounts,
    },
    "bsc-testnet": {
      gasPrice: 20e9,
      gas: 25e6,
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""],
    },
    "bsc-mainnet": {
      url: "https://bsc-dataseed.binance.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
          evmVersion: "istanbul",
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
          evmVersion: "istanbul",
          outputSelection: {
            "*": {
              "": ["ast"],
              "*": [
                "evm.bytecode.object",
                "evm.deployedBytecode.object",
                "abi",
                "evm.bytecode.sourceMap",
                "evm.deployedBytecode.sourceMap",
                "metadata",
              ],
            },
          },
        },
      },

      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
          evmVersion: "istanbul",
        },
      },
    ],
  },
  paths: {
    artifacts: "artifacts",
    cache: "cache",
    deploy: "deploy",
    deployments: "deployments",
    imports: "imports",
    sources: "contracts",
    tests: "test",
  },
  preprocess: {
    eachLine: removeConsoleLog((bre) => bre.network.name !== "hardhat" && bre.network.name !== "localhost"),
  },

  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  typechain: {
    outDir: "./typechain",
    target: "ethers-v5",
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
  },
}

extendEnvironment((hre) => {
  logger.debug(`hre.network.name: ${hre.network.name}`)
  // lazyObject(() => require("./tasks"))
})
export default config
