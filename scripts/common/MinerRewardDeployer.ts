import { ethers, upgrades } from "hardhat"
import { DeployTemplate } from "../common/deployTemplate"
import { logger } from "../utilities/log"
import { expandTo18Decimals } from "../utilities"
import { MinerReward, LinearRelease } from "../../typechain"
export class MinerRewardDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer

    // Load contract factories without external libraries
    const [MinerRewardFactory, LinearReleaseFactory] = await Promise.all(
      ["MinerReward", "LinearRelease"].map((contractName) => ethers.getContractFactory(contractName, deployer))
    )

    //TODO confirm reward per block
    const minerReward = (await upgrades.deployProxy(
      MinerRewardFactory,
      [
        (
          await ethers.provider.getBlock("latest")
        ).timestamp, // _firstPeriodStartTime
        expandTo18Decimals(100), // rewardPerBlock
      ],
      {
        initializer: "initialize",
      }
    )) as MinerReward

    logger.info("MinerReward proxy deployed to:", minerReward.address)
    output.MinerReward = minerReward.address
    contractsMap.MinerReward = minerReward

    //TODO confirm linear release settings
    const linearRelease = (await upgrades.deployProxy(
      LinearReleaseFactory,
      [
        output.platformToken, // reward token
        5000, // lockupBps
        10, // release period blocks
        minerReward.address,
      ],
      {
        initializer: "initialize",
      }
    )) as LinearRelease

    logger.info("LinearRelease proxy deployed to:", linearRelease.address)
    output.LinearRelease = linearRelease.address
    contractsMap.LinearRelease = linearRelease
  }
}
