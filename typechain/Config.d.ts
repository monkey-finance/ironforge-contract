/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface ConfigInterface extends ethers.utils.Interface {
  functions: {
    "batchSet(bytes32[],uint256[])": FunctionFragment;
    "deleteUint(bytes32)": FunctionFragment;
    "getBuildRatio(bytes32)": FunctionFragment;
    "getUint(bytes32)": FunctionFragment;
    "initialize()": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setBuildRatio(bytes32,uint256)": FunctionFragment;
    "setUint(bytes32,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "batchSet",
    values: [BytesLike[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteUint",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getBuildRatio",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "getUint", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setBuildRatio",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setUint",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "batchSet", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deleteUint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getBuildRatio",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getUint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBuildRatio",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setUint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "SetBuildRatioConfig(bytes32,uint256)": EventFragment;
    "SetUintConfig(bytes32,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetBuildRatioConfig"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetUintConfig"): EventFragment;
}

export class Config extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: ConfigInterface;

  functions: {
    batchSet(
      names: BytesLike[],
      values: BigNumberish[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "batchSet(bytes32[],uint256[])"(
      names: BytesLike[],
      values: BigNumberish[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    deleteUint(
      key: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "deleteUint(bytes32)"(
      key: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    getBuildRatio(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getBuildRatio(bytes32)"(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUint(key: BytesLike, overrides?: CallOverrides): Promise<[BigNumber]>;

    "getUint(bytes32)"(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    initialize(overrides?: Overrides): Promise<ContractTransaction>;

    "initialize()"(overrides?: Overrides): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    "owner()"(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(overrides?: Overrides): Promise<ContractTransaction>;

    "renounceOwnership()"(overrides?: Overrides): Promise<ContractTransaction>;

    setBuildRatio(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setBuildRatio(bytes32,uint256)"(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setUint(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setUint(bytes32,uint256)"(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  batchSet(
    names: BytesLike[],
    values: BigNumberish[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "batchSet(bytes32[],uint256[])"(
    names: BytesLike[],
    values: BigNumberish[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  deleteUint(
    key: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "deleteUint(bytes32)"(
    key: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  getBuildRatio(key: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

  "getBuildRatio(bytes32)"(
    key: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUint(key: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

  "getUint(bytes32)"(
    key: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  initialize(overrides?: Overrides): Promise<ContractTransaction>;

  "initialize()"(overrides?: Overrides): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(overrides?: Overrides): Promise<ContractTransaction>;

  "renounceOwnership()"(overrides?: Overrides): Promise<ContractTransaction>;

  setBuildRatio(
    key: BytesLike,
    value: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setBuildRatio(bytes32,uint256)"(
    key: BytesLike,
    value: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setUint(
    key: BytesLike,
    value: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setUint(bytes32,uint256)"(
    key: BytesLike,
    value: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "transferOwnership(address)"(
    newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    batchSet(
      names: BytesLike[],
      values: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    "batchSet(bytes32[],uint256[])"(
      names: BytesLike[],
      values: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    deleteUint(key: BytesLike, overrides?: CallOverrides): Promise<void>;

    "deleteUint(bytes32)"(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    getBuildRatio(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getBuildRatio(bytes32)"(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUint(key: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    "getUint(bytes32)"(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(overrides?: CallOverrides): Promise<void>;

    "initialize()"(overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    "renounceOwnership()"(overrides?: CallOverrides): Promise<void>;

    setBuildRatio(
      key: BytesLike,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setBuildRatio(bytes32,uint256)"(
      key: BytesLike,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setUint(
      key: BytesLike,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setUint(bytes32,uint256)"(
      key: BytesLike,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    OwnershipTransferred(
      previousOwner: string | null,
      newOwner: string | null
    ): EventFilter;

    SetBuildRatioConfig(key: null, value: null): EventFilter;

    SetUintConfig(key: null, value: null): EventFilter;
  };

  estimateGas: {
    batchSet(
      names: BytesLike[],
      values: BigNumberish[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    "batchSet(bytes32[],uint256[])"(
      names: BytesLike[],
      values: BigNumberish[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    deleteUint(key: BytesLike, overrides?: Overrides): Promise<BigNumber>;

    "deleteUint(bytes32)"(
      key: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    getBuildRatio(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getBuildRatio(bytes32)"(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUint(key: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    "getUint(bytes32)"(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(overrides?: Overrides): Promise<BigNumber>;

    "initialize()"(overrides?: Overrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides): Promise<BigNumber>;

    "renounceOwnership()"(overrides?: Overrides): Promise<BigNumber>;

    setBuildRatio(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setBuildRatio(bytes32,uint256)"(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setUint(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setUint(bytes32,uint256)"(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    batchSet(
      names: BytesLike[],
      values: BigNumberish[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "batchSet(bytes32[],uint256[])"(
      names: BytesLike[],
      values: BigNumberish[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    deleteUint(
      key: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "deleteUint(bytes32)"(
      key: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    getBuildRatio(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getBuildRatio(bytes32)"(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUint(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUint(bytes32)"(
      key: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(overrides?: Overrides): Promise<PopulatedTransaction>;

    "initialize()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides): Promise<PopulatedTransaction>;

    "renounceOwnership()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    setBuildRatio(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setBuildRatio(bytes32,uint256)"(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setUint(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setUint(bytes32,uint256)"(
      key: BytesLike,
      value: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}