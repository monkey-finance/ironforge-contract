import fs from "fs"
import { logger } from "../utilities/log"
import { Contract } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

export abstract class DeployTemplate {
  private _output: Record<string, string | Record<string, string>>
  private _outputContracts: Record<string, Contract>
  private _deployer: SignerWithAddress
  private _outputFileName = "global.bscmainnet.json"
  private _saveFile = true
  constructor(
    deployer: SignerWithAddress,
    output?: Record<string, string | Record<string, string>>,
    outputContracts?: Record<string, Contract>
  ) {
    this._output = output ?? {}
    this._outputContracts = outputContracts ?? {}
    this._deployer = deployer
  }
  get saveFile(): boolean {
    return this._saveFile
  }

  set saveFile(value: boolean) {
    this._saveFile = value
  }
  get outputFileName(): string {
    return this._outputFileName
  }

  set outputFileName(value: string) {
    this._outputFileName = value
  }

  get deployer(): SignerWithAddress {
    return this._deployer
  }

  get output(): Record<string, string | Record<string, string>> {
    return this._output
  }

  get outputContracts(): Record<string, Contract> {
    return this._outputContracts
  }

  private readConfigFile() {
    this._output = JSON.parse(fs.readFileSync(this._outputFileName).toString()) as Record<string, any>
    // logger.debug(`read global.bscmainnet.json : ${JSON.stringify(this._output)}`)
  }

  private writeConfigFile() {
    fs.writeFileSync(this._outputFileName, JSON.stringify(this._output, null, 4))
  }

  protected abstract doDeploy(): Promise<void>

  async deploy(): Promise<Record<string, Contract>> {
    if (this.saveFile) {
      this.readConfigFile()
    }
    await this.doDeploy()
    if (this.saveFile) {
      this.writeConfigFile()
    }
    return this._outputContracts
  }
}
