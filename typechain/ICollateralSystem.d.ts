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

interface ICollateralSystemInterface extends ethers.utils.Interface {
  functions: {
    "IsSatisfyTargetRatio(address,bytes32)": FunctionFragment;
    "burnAndUnstakeFromExchange(address,uint256,bytes32,uint256)": FunctionFragment;
    "calcBuildRatio(address,bytes32,uint256,uint256)": FunctionFragment;
    "getFreeCollateralInUsd(address,bytes32)": FunctionFragment;
    "getRatio(address,bytes32)": FunctionFragment;
    "getUserCollateral(address,bytes32)": FunctionFragment;
    "getUserPlatformTokenCollateral(address)": FunctionFragment;
    "getUserTotalCollateralInUsd(address)": FunctionFragment;
    "moveCollateral(address,address,bytes32,uint256)": FunctionFragment;
    "withdrawLockedTokens(address,bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "IsSatisfyTargetRatio",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "burnAndUnstakeFromExchange",
    values: [string, BigNumberish, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calcBuildRatio",
    values: [string, BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getFreeCollateralInUsd",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRatio",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserCollateral",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserPlatformTokenCollateral",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserTotalCollateralInUsd",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "moveCollateral",
    values: [string, string, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawLockedTokens",
    values: [string, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "IsSatisfyTargetRatio",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "burnAndUnstakeFromExchange",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calcBuildRatio",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFreeCollateralInUsd",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRatio", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getUserCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserPlatformTokenCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserTotalCollateralInUsd",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "moveCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawLockedTokens",
    data: BytesLike
  ): Result;

  events: {};
}

export class ICollateralSystem extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: ICollateralSystemInterface;

  functions: {
    IsSatisfyTargetRatio(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "IsSatisfyTargetRatio(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    burnAndUnstakeFromExchange(
      user: string,
      burnAmount: BigNumberish,
      unStakeCurrency: BytesLike,
      unStakeAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "burnAndUnstakeFromExchange(address,uint256,bytes32,uint256)"(
      user: string,
      burnAmount: BigNumberish,
      unStakeCurrency: BytesLike,
      unStakeAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    calcBuildRatio(
      user: string,
      stakeCurrency: BytesLike,
      stakeAmount: BigNumberish,
      lockedAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "calcBuildRatio(address,bytes32,uint256,uint256)"(
      user: string,
      stakeCurrency: BytesLike,
      stakeAmount: BigNumberish,
      lockedAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getFreeCollateralInUsd(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getFreeCollateralInUsd(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getRatio(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    "getRatio(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getUserCollateral(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getUserCollateral(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUserPlatformTokenCollateral(
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { staked: BigNumber }>;

    "getUserPlatformTokenCollateral(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { staked: BigNumber }>;

    getUserTotalCollateralInUsd(
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { total: BigNumber }>;

    "getUserTotalCollateralInUsd(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { total: BigNumber }>;

    moveCollateral(
      fromUser: string,
      toUser: string,
      currency: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "moveCollateral(address,address,bytes32,uint256)"(
      fromUser: string,
      toUser: string,
      currency: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    withdrawLockedTokens(
      _user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "withdrawLockedTokens(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  IsSatisfyTargetRatio(
    _user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "IsSatisfyTargetRatio(address,bytes32)"(
    _user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  burnAndUnstakeFromExchange(
    user: string,
    burnAmount: BigNumberish,
    unStakeCurrency: BytesLike,
    unStakeAmount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "burnAndUnstakeFromExchange(address,uint256,bytes32,uint256)"(
    user: string,
    burnAmount: BigNumberish,
    unStakeCurrency: BytesLike,
    unStakeAmount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  calcBuildRatio(
    user: string,
    stakeCurrency: BytesLike,
    stakeAmount: BigNumberish,
    lockedAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "calcBuildRatio(address,bytes32,uint256,uint256)"(
    user: string,
    stakeCurrency: BytesLike,
    stakeAmount: BigNumberish,
    lockedAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getFreeCollateralInUsd(
    user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getFreeCollateralInUsd(address,bytes32)"(
    user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getRatio(
    _user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  "getRatio(address,bytes32)"(
    _user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  getUserCollateral(
    _user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getUserCollateral(address,bytes32)"(
    _user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserPlatformTokenCollateral(
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getUserPlatformTokenCollateral(address)"(
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserTotalCollateralInUsd(
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getUserTotalCollateralInUsd(address)"(
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  moveCollateral(
    fromUser: string,
    toUser: string,
    currency: BytesLike,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "moveCollateral(address,address,bytes32,uint256)"(
    fromUser: string,
    toUser: string,
    currency: BytesLike,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  withdrawLockedTokens(
    _user: string,
    _currency: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "withdrawLockedTokens(address,bytes32)"(
    _user: string,
    _currency: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    IsSatisfyTargetRatio(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "IsSatisfyTargetRatio(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    burnAndUnstakeFromExchange(
      user: string,
      burnAmount: BigNumberish,
      unStakeCurrency: BytesLike,
      unStakeAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "burnAndUnstakeFromExchange(address,uint256,bytes32,uint256)"(
      user: string,
      burnAmount: BigNumberish,
      unStakeCurrency: BytesLike,
      unStakeAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    calcBuildRatio(
      user: string,
      stakeCurrency: BytesLike,
      stakeAmount: BigNumberish,
      lockedAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "calcBuildRatio(address,bytes32,uint256,uint256)"(
      user: string,
      stakeCurrency: BytesLike,
      stakeAmount: BigNumberish,
      lockedAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFreeCollateralInUsd(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getFreeCollateralInUsd(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRatio(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    "getRatio(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getUserCollateral(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserCollateral(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserPlatformTokenCollateral(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserPlatformTokenCollateral(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserTotalCollateralInUsd(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserTotalCollateralInUsd(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    moveCollateral(
      fromUser: string,
      toUser: string,
      currency: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "moveCollateral(address,address,bytes32,uint256)"(
      fromUser: string,
      toUser: string,
      currency: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawLockedTokens(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "withdrawLockedTokens(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    IsSatisfyTargetRatio(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "IsSatisfyTargetRatio(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burnAndUnstakeFromExchange(
      user: string,
      burnAmount: BigNumberish,
      unStakeCurrency: BytesLike,
      unStakeAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "burnAndUnstakeFromExchange(address,uint256,bytes32,uint256)"(
      user: string,
      burnAmount: BigNumberish,
      unStakeCurrency: BytesLike,
      unStakeAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    calcBuildRatio(
      user: string,
      stakeCurrency: BytesLike,
      stakeAmount: BigNumberish,
      lockedAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "calcBuildRatio(address,bytes32,uint256,uint256)"(
      user: string,
      stakeCurrency: BytesLike,
      stakeAmount: BigNumberish,
      lockedAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFreeCollateralInUsd(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getFreeCollateralInUsd(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRatio(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getRatio(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserCollateral(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserCollateral(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserPlatformTokenCollateral(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserPlatformTokenCollateral(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserTotalCollateralInUsd(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserTotalCollateralInUsd(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    moveCollateral(
      fromUser: string,
      toUser: string,
      currency: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "moveCollateral(address,address,bytes32,uint256)"(
      fromUser: string,
      toUser: string,
      currency: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    withdrawLockedTokens(
      _user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "withdrawLockedTokens(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    IsSatisfyTargetRatio(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "IsSatisfyTargetRatio(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burnAndUnstakeFromExchange(
      user: string,
      burnAmount: BigNumberish,
      unStakeCurrency: BytesLike,
      unStakeAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "burnAndUnstakeFromExchange(address,uint256,bytes32,uint256)"(
      user: string,
      burnAmount: BigNumberish,
      unStakeCurrency: BytesLike,
      unStakeAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    calcBuildRatio(
      user: string,
      stakeCurrency: BytesLike,
      stakeAmount: BigNumberish,
      lockedAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "calcBuildRatio(address,bytes32,uint256,uint256)"(
      user: string,
      stakeCurrency: BytesLike,
      stakeAmount: BigNumberish,
      lockedAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFreeCollateralInUsd(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getFreeCollateralInUsd(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRatio(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getRatio(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserCollateral(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUserCollateral(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserPlatformTokenCollateral(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUserPlatformTokenCollateral(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserTotalCollateralInUsd(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUserTotalCollateralInUsd(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    moveCollateral(
      fromUser: string,
      toUser: string,
      currency: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "moveCollateral(address,address,bytes32,uint256)"(
      fromUser: string,
      toUser: string,
      currency: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    withdrawLockedTokens(
      _user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "withdrawLockedTokens(address,bytes32)"(
      _user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
