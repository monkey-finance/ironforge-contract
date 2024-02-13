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

interface AddressStorageInterface extends ethers.utils.Interface {
  functions: {
    "__AdminUpgradeable_init(address)": FunctionFragment;
    "addressMap(bytes32)": FunctionFragment;
    "admin()": FunctionFragment;
    "becomeAdmin()": FunctionFragment;
    "candidate()": FunctionFragment;
    "getAddress(bytes32)": FunctionFragment;
    "getAddressWithRequire(bytes32,string)": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "setCandidate(address)": FunctionFragment;
    "update(bytes32,address)": FunctionFragment;
    "updateAll(bytes32[],address[])": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "__AdminUpgradeable_init",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "addressMap",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "becomeAdmin",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "candidate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getAddress",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getAddressWithRequire",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setCandidate",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "update",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateAll",
    values: [BytesLike[], string[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "__AdminUpgradeable_init",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addressMap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "becomeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "candidate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getAddress", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAddressWithRequire",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setCandidate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "update", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "updateAll", data: BytesLike): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "CandidateChanged(address,address)": EventFragment;
    "StorageAddressUpdated(bytes32,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CandidateChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StorageAddressUpdated"): EventFragment;
}

export class AddressStorage extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: AddressStorageInterface;

  functions: {
    __AdminUpgradeable_init(
      _admin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "__AdminUpgradeable_init(address)"(
      _admin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    addressMap(arg0: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    "addressMap(bytes32)"(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    "admin()"(overrides?: CallOverrides): Promise<[string]>;

    becomeAdmin(overrides?: Overrides): Promise<ContractTransaction>;

    "becomeAdmin()"(overrides?: Overrides): Promise<ContractTransaction>;

    candidate(overrides?: CallOverrides): Promise<[string]>;

    "candidate()"(overrides?: CallOverrides): Promise<[string]>;

    getAddress(name: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    "getAddress(bytes32)"(
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getAddressWithRequire(
      name: BytesLike,
      reason: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "getAddressWithRequire(bytes32,string)"(
      name: BytesLike,
      reason: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    initialize(
      _admin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "initialize(address)"(
      _admin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setCandidate(
      _candidate: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setCandidate(address)"(
      _candidate: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    update(
      name: BytesLike,
      dest: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "update(bytes32,address)"(
      name: BytesLike,
      dest: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    updateAll(
      names: BytesLike[],
      destinations: string[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "updateAll(bytes32[],address[])"(
      names: BytesLike[],
      destinations: string[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  __AdminUpgradeable_init(
    _admin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "__AdminUpgradeable_init(address)"(
    _admin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  addressMap(arg0: BytesLike, overrides?: CallOverrides): Promise<string>;

  "addressMap(bytes32)"(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  admin(overrides?: CallOverrides): Promise<string>;

  "admin()"(overrides?: CallOverrides): Promise<string>;

  becomeAdmin(overrides?: Overrides): Promise<ContractTransaction>;

  "becomeAdmin()"(overrides?: Overrides): Promise<ContractTransaction>;

  candidate(overrides?: CallOverrides): Promise<string>;

  "candidate()"(overrides?: CallOverrides): Promise<string>;

  getAddress(name: BytesLike, overrides?: CallOverrides): Promise<string>;

  "getAddress(bytes32)"(
    name: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getAddressWithRequire(
    name: BytesLike,
    reason: string,
    overrides?: CallOverrides
  ): Promise<string>;

  "getAddressWithRequire(bytes32,string)"(
    name: BytesLike,
    reason: string,
    overrides?: CallOverrides
  ): Promise<string>;

  initialize(
    _admin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "initialize(address)"(
    _admin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setCandidate(
    _candidate: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setCandidate(address)"(
    _candidate: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  update(
    name: BytesLike,
    dest: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "update(bytes32,address)"(
    name: BytesLike,
    dest: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  updateAll(
    names: BytesLike[],
    destinations: string[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "updateAll(bytes32[],address[])"(
    names: BytesLike[],
    destinations: string[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    __AdminUpgradeable_init(
      _admin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "__AdminUpgradeable_init(address)"(
      _admin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    addressMap(arg0: BytesLike, overrides?: CallOverrides): Promise<string>;

    "addressMap(bytes32)"(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    admin(overrides?: CallOverrides): Promise<string>;

    "admin()"(overrides?: CallOverrides): Promise<string>;

    becomeAdmin(overrides?: CallOverrides): Promise<void>;

    "becomeAdmin()"(overrides?: CallOverrides): Promise<void>;

    candidate(overrides?: CallOverrides): Promise<string>;

    "candidate()"(overrides?: CallOverrides): Promise<string>;

    getAddress(name: BytesLike, overrides?: CallOverrides): Promise<string>;

    "getAddress(bytes32)"(
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getAddressWithRequire(
      name: BytesLike,
      reason: string,
      overrides?: CallOverrides
    ): Promise<string>;

    "getAddressWithRequire(bytes32,string)"(
      name: BytesLike,
      reason: string,
      overrides?: CallOverrides
    ): Promise<string>;

    initialize(_admin: string, overrides?: CallOverrides): Promise<void>;

    "initialize(address)"(
      _admin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setCandidate(_candidate: string, overrides?: CallOverrides): Promise<void>;

    "setCandidate(address)"(
      _candidate: string,
      overrides?: CallOverrides
    ): Promise<void>;

    update(
      name: BytesLike,
      dest: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "update(bytes32,address)"(
      name: BytesLike,
      dest: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateAll(
      names: BytesLike[],
      destinations: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    "updateAll(bytes32[],address[])"(
      names: BytesLike[],
      destinations: string[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    AdminChanged(oldAdmin: null, newAdmin: null): EventFilter;

    CandidateChanged(oldCandidate: null, newCandidate: null): EventFilter;

    StorageAddressUpdated(name: null, addr: null): EventFilter;
  };

  estimateGas: {
    __AdminUpgradeable_init(
      _admin: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "__AdminUpgradeable_init(address)"(
      _admin: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    addressMap(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    "addressMap(bytes32)"(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    "admin()"(overrides?: CallOverrides): Promise<BigNumber>;

    becomeAdmin(overrides?: Overrides): Promise<BigNumber>;

    "becomeAdmin()"(overrides?: Overrides): Promise<BigNumber>;

    candidate(overrides?: CallOverrides): Promise<BigNumber>;

    "candidate()"(overrides?: CallOverrides): Promise<BigNumber>;

    getAddress(name: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    "getAddress(bytes32)"(
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAddressWithRequire(
      name: BytesLike,
      reason: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getAddressWithRequire(bytes32,string)"(
      name: BytesLike,
      reason: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(_admin: string, overrides?: Overrides): Promise<BigNumber>;

    "initialize(address)"(
      _admin: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setCandidate(_candidate: string, overrides?: Overrides): Promise<BigNumber>;

    "setCandidate(address)"(
      _candidate: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    update(
      name: BytesLike,
      dest: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "update(bytes32,address)"(
      name: BytesLike,
      dest: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    updateAll(
      names: BytesLike[],
      destinations: string[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    "updateAll(bytes32[],address[])"(
      names: BytesLike[],
      destinations: string[],
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    __AdminUpgradeable_init(
      _admin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "__AdminUpgradeable_init(address)"(
      _admin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    addressMap(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "addressMap(bytes32)"(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "admin()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    becomeAdmin(overrides?: Overrides): Promise<PopulatedTransaction>;

    "becomeAdmin()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    candidate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "candidate()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAddress(
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getAddress(bytes32)"(
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAddressWithRequire(
      name: BytesLike,
      reason: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getAddressWithRequire(bytes32,string)"(
      name: BytesLike,
      reason: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _admin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "initialize(address)"(
      _admin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setCandidate(
      _candidate: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setCandidate(address)"(
      _candidate: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    update(
      name: BytesLike,
      dest: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "update(bytes32,address)"(
      name: BytesLike,
      dest: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    updateAll(
      names: BytesLike[],
      destinations: string[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "updateAll(bytes32[],address[])"(
      names: BytesLike[],
      destinations: string[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
