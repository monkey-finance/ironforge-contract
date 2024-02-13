import { DEPLOYER_PRIVATE_KEY } from "../scripts/utilities/keys"
import { deployAddresses } from "../scripts/utilities/deployAddresses"
import configAbi from "../abi/Config.json"
import accessControlAbi from "../abi/AccessControl.json"
import assetSystemAbi from "../abi/AssetSystem.json"
import pancakePairAbi from "../abi/PancakePair.json"
import pancakeFactoryAbi from "../abi/PancakeFactory.json"
import pancakeRouterAbi from "../abi/PancakeRouterV2.json"
import collateralSystemAbi from "../abi/CollateralSystem.json"
import {
  AccessControl,
  AssetSystem,
  CollateralSystem,
  Config,
  PancakeFactory,
  PancakePair,
  PancakeRouterV2,
} from "../typechain"
import { testAfterDeploy } from "../scripts/testnet/delpoyTests/test"
import { DeployedStackResult } from "../scripts/testnet/deployParamTypes"
import { task } from "hardhat/config"

export const cmdAfterDeployCheck = task("a-cmdAfterDeployCheck").setAction(async function ({}, { ethers, run }) {
  const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)
  const config = new ethers.Contract(deployAddresses.Config, configAbi, deployer) as Config
  const accessControl = new ethers.Contract(deployAddresses.AccessControl, accessControlAbi, deployer) as AccessControl
  const assetSystem = new ethers.Contract(deployAddresses.AssetSystem, assetSystemAbi, deployer) as AssetSystem
  const lp_usdc_BST = new ethers.Contract(deployAddresses["USDC-BST"], pancakePairAbi, deployer) as PancakePair
  const pancakeFactory = new ethers.Contract(
    deployAddresses.pancakeFactory,
    pancakeFactoryAbi,
    deployer
  ) as PancakeFactory

  const pancakeRouter = new ethers.Contract(
    deployAddresses.pancakeRouter,
    pancakeRouterAbi,
    deployer
  ) as PancakeRouterV2

  const collateralSystem = new ethers.Contract(
    deployAddresses.CollateralSystem,
    collateralSystemAbi,
    deployer
  ) as CollateralSystem
  const deployed = <DeployedStackResult>{
    accessControl,
    assetSystem,
    collateralSystem,
    config,
    lp_usdc_BST,
    output: deployAddresses,
    pancakeFactory,
    pancakeRouter,
  }
  await testAfterDeploy({ deployer, ethers, deployed })
})
