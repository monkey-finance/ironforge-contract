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

interface ILockerInterface extends ethers.utils.Interface {
  functions: {
    "calLockAmount(uint256)": FunctionFragment;
    "claim()": FunctionFragment;
    "getLocks(address,uint256)": FunctionFragment;
    "lock(address,uint256,uint256)": FunctionFragment;
    "lockOf(address,uint256)": FunctionFragment;
    "pendingTokens(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calLockAmount",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "claim", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getLocks",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "lock",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "lockOf",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pendingTokens",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "calLockAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getLocks", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lock", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lockOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingTokens",
    data: BytesLike
  ): Result;

  events: {
    "Lock(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Lock"): EventFragment;
}

export class ILocker extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: ILockerInterface;

  functions: {
    calLockAmount(
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "calLockAmount(uint256)"(
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    claim(overrides?: Overrides): Promise<ContractTransaction>;

    "claim()"(overrides?: Overrides): Promise<ContractTransaction>;

    getLocks(
      _user: string,
      _poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getLocks(address,uint256)"(
      _user: string,
      _poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    lock(
      user: string,
      poolId: BigNumberish,
      alpacaAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "lock(address,uint256,uint256)"(
      user: string,
      poolId: BigNumberish,
      alpacaAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    lockOf(
      user: string,
      poolId: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "lockOf(address,uint256)"(
      user: string,
      poolId: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    pendingTokens(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "pendingTokens(address,uint256)"(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  calLockAmount(
    alpacaAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "calLockAmount(uint256)"(
    alpacaAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  claim(overrides?: Overrides): Promise<ContractTransaction>;

  "claim()"(overrides?: Overrides): Promise<ContractTransaction>;

  getLocks(
    _user: string,
    _poolId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getLocks(address,uint256)"(
    _user: string,
    _poolId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  lock(
    user: string,
    poolId: BigNumberish,
    alpacaAmount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "lock(address,uint256,uint256)"(
    user: string,
    poolId: BigNumberish,
    alpacaAmount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  lockOf(
    user: string,
    poolId: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "lockOf(address,uint256)"(
    user: string,
    poolId: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  pendingTokens(
    user: string,
    poolId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "pendingTokens(address,uint256)"(
    user: string,
    poolId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    calLockAmount(
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "calLockAmount(uint256)"(
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claim(overrides?: CallOverrides): Promise<void>;

    "claim()"(overrides?: CallOverrides): Promise<void>;

    getLocks(
      _user: string,
      _poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getLocks(address,uint256)"(
      _user: string,
      _poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lock(
      user: string,
      poolId: BigNumberish,
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "lock(address,uint256,uint256)"(
      user: string,
      poolId: BigNumberish,
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    lockOf(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "lockOf(address,uint256)"(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pendingTokens(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "pendingTokens(address,uint256)"(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    Lock(to: string | null, value: null): EventFilter;
  };

  estimateGas: {
    calLockAmount(
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "calLockAmount(uint256)"(
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claim(overrides?: Overrides): Promise<BigNumber>;

    "claim()"(overrides?: Overrides): Promise<BigNumber>;

    getLocks(
      _user: string,
      _poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getLocks(address,uint256)"(
      _user: string,
      _poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lock(
      user: string,
      poolId: BigNumberish,
      alpacaAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "lock(address,uint256,uint256)"(
      user: string,
      poolId: BigNumberish,
      alpacaAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    lockOf(
      user: string,
      poolId: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "lockOf(address,uint256)"(
      user: string,
      poolId: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    pendingTokens(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "pendingTokens(address,uint256)"(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    calLockAmount(
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "calLockAmount(uint256)"(
      alpacaAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claim(overrides?: Overrides): Promise<PopulatedTransaction>;

    "claim()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    getLocks(
      _user: string,
      _poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getLocks(address,uint256)"(
      _user: string,
      _poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lock(
      user: string,
      poolId: BigNumberish,
      alpacaAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "lock(address,uint256,uint256)"(
      user: string,
      poolId: BigNumberish,
      alpacaAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    lockOf(
      user: string,
      poolId: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "lockOf(address,uint256)"(
      user: string,
      poolId: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    pendingTokens(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "pendingTokens(address,uint256)"(
      user: string,
      poolId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
