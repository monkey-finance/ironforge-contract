import { ethers, upgrades } from "hardhat"
import { DeployTemplate } from "../common/deployTemplate"
import { logger } from "../utilities/log"
import { RewardSystem } from "../../typechain"

export class RewardSystemDeployer extends DeployTemplate {
  protected async doDeploy(): Promise<void> {
    const output = this.output
    const contractsMap = this.outputContracts
    const deployer = this.deployer
    const admin = deployer

    const [RewardSystemFactory] = await Promise.all(
      ["RewardSystem"].map((contractName) => ethers.getContractFactory(contractName, deployer))
    )

    /**
     * A contract for distributing rewards calculated and signed off-chain.
     */
    const rewardSystem = (await upgrades.deployProxy(
      RewardSystemFactory,
      [
        (
          await ethers.provider.getBlock("latest")
        ).timestamp, // _firstPeriodStartTime
        admin.address, // _rewardSigner
        (output.synths as Record<string, string>).FUSD, // _fusdAddress
        output.CollateralSystem, // _collateralSystemAddress
        admin.address, // _admin
      ],
      {
        initializer: "initialize",
      }
    )) as RewardSystem

    logger.info("RewardSystem proxy deployed to:", rewardSystem.address)
    output.RewardSystem = rewardSystem.address
    contractsMap.RewardSystem = rewardSystem
  }
}