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

interface LiquidationInterface extends ethers.utils.Interface {
  functions: {
    "BuildBurnSystem()": FunctionFragment;
    "CollateralSystem()": FunctionFragment;
    "Config()": FunctionFragment;
    "DebtSystem()": FunctionFragment;
    "LIQUIDATION_DELAY_KEY()": FunctionFragment;
    "LIQUIDATION_LIQUIDATOR_REWARD_KEY()": FunctionFragment;
    "LIQUIDATION_MARKER_REWARD_KEY()": FunctionFragment;
    "LIQUIDATION_RATIO_KEY()": FunctionFragment;
    "Prices()": FunctionFragment;
    "__AdminUpgradeable_init(address)": FunctionFragment;
    "admin()": FunctionFragment;
    "becomeAdmin()": FunctionFragment;
    "candidate()": FunctionFragment;
    "evalUserPosition(address,bytes32)": FunctionFragment;
    "evalUserPositionAll(address,bytes32)": FunctionFragment;
    "getMarkTimestamp(address)": FunctionFragment;
    "getMarker(address)": FunctionFragment;
    "initialize(address,address,address,address,address,address)": FunctionFragment;
    "isPositionMarked(address)": FunctionFragment;
    "liquidatePosition(address,uint256,bytes32)": FunctionFragment;
    "liquidatePositionMax(address,bytes32)": FunctionFragment;
    "markPosition(address,bytes32)": FunctionFragment;
    "removeMark(address,bytes32)": FunctionFragment;
    "setCandidate(address)": FunctionFragment;
    "setPrices(address)": FunctionFragment;
    "underCollateralizedMarks(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "BuildBurnSystem",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "CollateralSystem",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "Config", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "DebtSystem",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "LIQUIDATION_DELAY_KEY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "LIQUIDATION_LIQUIDATOR_REWARD_KEY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "LIQUIDATION_MARKER_REWARD_KEY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "LIQUIDATION_RATIO_KEY",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "Prices", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "__AdminUpgradeable_init",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "becomeAdmin",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "candidate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "evalUserPosition",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "evalUserPositionAll",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getMarkTimestamp",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getMarker", values: [string]): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isPositionMarked",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "liquidatePosition",
    values: [string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "liquidatePositionMax",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "markPosition",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeMark",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setCandidate",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "setPrices", values: [string]): string;
  encodeFunctionData(
    functionFragment: "underCollateralizedMarks",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "BuildBurnSystem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "CollateralSystem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "Config", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "DebtSystem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "LIQUIDATION_DELAY_KEY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "LIQUIDATION_LIQUIDATOR_REWARD_KEY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "LIQUIDATION_MARKER_REWARD_KEY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "LIQUIDATION_RATIO_KEY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "Prices", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "__AdminUpgradeable_init",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "becomeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "candidate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "evalUserPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "evalUserPositionAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMarkTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getMarker", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isPositionMarked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "liquidatePosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "liquidatePositionMax",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "markPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "removeMark", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setCandidate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPrices", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "underCollateralizedMarks",
    data: BytesLike
  ): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "CandidateChanged(address,address)": EventFragment;
    "PositionLiquidated(address,address,address,uint256,bytes32,uint256,uint256,uint256)": EventFragment;
    "PositionMarked(address,address)": EventFragment;
    "PositionUnmarked(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CandidateChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PositionLiquidated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PositionMarked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PositionUnmarked"): EventFragment;
}

export class Liquidation extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: LiquidationInterface;

  functions: {
    BuildBurnSystem(overrides?: CallOverrides): Promise<[string]>;

    "BuildBurnSystem()"(overrides?: CallOverrides): Promise<[string]>;

    CollateralSystem(overrides?: CallOverrides): Promise<[string]>;

    "CollateralSystem()"(overrides?: CallOverrides): Promise<[string]>;

    Config(overrides?: CallOverrides): Promise<[string]>;

    "Config()"(overrides?: CallOverrides): Promise<[string]>;

    DebtSystem(overrides?: CallOverrides): Promise<[string]>;

    "DebtSystem()"(overrides?: CallOverrides): Promise<[string]>;

    LIQUIDATION_DELAY_KEY(overrides?: CallOverrides): Promise<[string]>;

    "LIQUIDATION_DELAY_KEY()"(overrides?: CallOverrides): Promise<[string]>;

    LIQUIDATION_LIQUIDATOR_REWARD_KEY(
      overrides?: CallOverrides
    ): Promise<[string]>;

    "LIQUIDATION_LIQUIDATOR_REWARD_KEY()"(
      overrides?: CallOverrides
    ): Promise<[string]>;

    LIQUIDATION_MARKER_REWARD_KEY(overrides?: CallOverrides): Promise<[string]>;

    "LIQUIDATION_MARKER_REWARD_KEY()"(
      overrides?: CallOverrides
    ): Promise<[string]>;

    LIQUIDATION_RATIO_KEY(overrides?: CallOverrides): Promise<[string]>;

    "LIQUIDATION_RATIO_KEY()"(overrides?: CallOverrides): Promise<[string]>;

    Prices(overrides?: CallOverrides): Promise<[string]>;

    "Prices()"(overrides?: CallOverrides): Promise<[string]>;

    __AdminUpgradeable_init(
      _admin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "__AdminUpgradeable_init(address)"(
      _admin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    "admin()"(overrides?: CallOverrides): Promise<[string]>;

    becomeAdmin(overrides?: Overrides): Promise<ContractTransaction>;

    "becomeAdmin()"(overrides?: Overrides): Promise<ContractTransaction>;

    candidate(overrides?: CallOverrides): Promise<[string]>;

    "candidate()"(overrides?: CallOverrides): Promise<[string]>;

    evalUserPosition(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
          debtBalance: BigNumber;
          stakedCollateral: BigNumber;
          collateralPrice: BigNumber;
          collateralValue: BigNumber;
          collateralizedRatio: BigNumber;
        }
      ]
    >;

    "evalUserPosition(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
          debtBalance: BigNumber;
          stakedCollateral: BigNumber;
          collateralPrice: BigNumber;
          collateralValue: BigNumber;
          collateralizedRatio: BigNumber;
        }
      ]
    >;

    evalUserPositionAll(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
          debtBalance: BigNumber;
          stakedCollateral: BigNumber;
          collateralPrice: BigNumber;
          collateralValue: BigNumber;
          collateralizedRatio: BigNumber;
        }
      ]
    >;

    "evalUserPositionAll(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
          debtBalance: BigNumber;
          stakedCollateral: BigNumber;
          collateralPrice: BigNumber;
          collateralValue: BigNumber;
          collateralizedRatio: BigNumber;
        }
      ]
    >;

    getMarkTimestamp(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getMarkTimestamp(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getMarker(user: string, overrides?: CallOverrides): Promise<[string]>;

    "getMarker(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    initialize(
      _BuildBurnSystem: string,
      _CollateralSystem: string,
      _Config: string,
      _DebtSystem: string,
      _Prices: string,
      _admin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "initialize(address,address,address,address,address,address)"(
      _BuildBurnSystem: string,
      _CollateralSystem: string,
      _Config: string,
      _DebtSystem: string,
      _Prices: string,
      _admin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    isPositionMarked(
      user: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "isPositionMarked(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    liquidatePosition(
      user: string,
      fusdToBurn: BigNumberish,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "liquidatePosition(address,uint256,bytes32)"(
      user: string,
      fusdToBurn: BigNumberish,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    liquidatePositionMax(
      user: string,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "liquidatePositionMax(address,bytes32)"(
      user: string,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    markPosition(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "markPosition(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    removeMark(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "removeMark(address,bytes32)"(
      user: string,
      _currency: BytesLike,
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

    setPrices(
      newPrices: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setPrices(address)"(
      newPrices: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    underCollateralizedMarks(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { marker: string; timestamp: BigNumber }>;

    "underCollateralizedMarks(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { marker: string; timestamp: BigNumber }>;
  };

  BuildBurnSystem(overrides?: CallOverrides): Promise<string>;

  "BuildBurnSystem()"(overrides?: CallOverrides): Promise<string>;

  CollateralSystem(overrides?: CallOverrides): Promise<string>;

  "CollateralSystem()"(overrides?: CallOverrides): Promise<string>;

  Config(overrides?: CallOverrides): Promise<string>;

  "Config()"(overrides?: CallOverrides): Promise<string>;

  DebtSystem(overrides?: CallOverrides): Promise<string>;

  "DebtSystem()"(overrides?: CallOverrides): Promise<string>;

  LIQUIDATION_DELAY_KEY(overrides?: CallOverrides): Promise<string>;

  "LIQUIDATION_DELAY_KEY()"(overrides?: CallOverrides): Promise<string>;

  LIQUIDATION_LIQUIDATOR_REWARD_KEY(overrides?: CallOverrides): Promise<string>;

  "LIQUIDATION_LIQUIDATOR_REWARD_KEY()"(
    overrides?: CallOverrides
  ): Promise<string>;

  LIQUIDATION_MARKER_REWARD_KEY(overrides?: CallOverrides): Promise<string>;

  "LIQUIDATION_MARKER_REWARD_KEY()"(overrides?: CallOverrides): Promise<string>;

  LIQUIDATION_RATIO_KEY(overrides?: CallOverrides): Promise<string>;

  "LIQUIDATION_RATIO_KEY()"(overrides?: CallOverrides): Promise<string>;

  Prices(overrides?: CallOverrides): Promise<string>;

  "Prices()"(overrides?: CallOverrides): Promise<string>;

  __AdminUpgradeable_init(
    _admin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "__AdminUpgradeable_init(address)"(
    _admin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  admin(overrides?: CallOverrides): Promise<string>;

  "admin()"(overrides?: CallOverrides): Promise<string>;

  becomeAdmin(overrides?: Overrides): Promise<ContractTransaction>;

  "becomeAdmin()"(overrides?: Overrides): Promise<ContractTransaction>;

  candidate(overrides?: CallOverrides): Promise<string>;

  "candidate()"(overrides?: CallOverrides): Promise<string>;

  evalUserPosition(
    user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      debtBalance: BigNumber;
      stakedCollateral: BigNumber;
      collateralPrice: BigNumber;
      collateralValue: BigNumber;
      collateralizedRatio: BigNumber;
    }
  >;

  "evalUserPosition(address,bytes32)"(
    user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      debtBalance: BigNumber;
      stakedCollateral: BigNumber;
      collateralPrice: BigNumber;
      collateralValue: BigNumber;
      collateralizedRatio: BigNumber;
    }
  >;

  evalUserPositionAll(
    user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      debtBalance: BigNumber;
      stakedCollateral: BigNumber;
      collateralPrice: BigNumber;
      collateralValue: BigNumber;
      collateralizedRatio: BigNumber;
    }
  >;

  "evalUserPositionAll(address,bytes32)"(
    user: string,
    _currency: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      debtBalance: BigNumber;
      stakedCollateral: BigNumber;
      collateralPrice: BigNumber;
      collateralValue: BigNumber;
      collateralizedRatio: BigNumber;
    }
  >;

  getMarkTimestamp(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  "getMarkTimestamp(address)"(
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getMarker(user: string, overrides?: CallOverrides): Promise<string>;

  "getMarker(address)"(
    user: string,
    overrides?: CallOverrides
  ): Promise<string>;

  initialize(
    _BuildBurnSystem: string,
    _CollateralSystem: string,
    _Config: string,
    _DebtSystem: string,
    _Prices: string,
    _admin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "initialize(address,address,address,address,address,address)"(
    _BuildBurnSystem: string,
    _CollateralSystem: string,
    _Config: string,
    _DebtSystem: string,
    _Prices: string,
    _admin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  isPositionMarked(user: string, overrides?: CallOverrides): Promise<boolean>;

  "isPositionMarked(address)"(
    user: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  liquidatePosition(
    user: string,
    fusdToBurn: BigNumberish,
    currency: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "liquidatePosition(address,uint256,bytes32)"(
    user: string,
    fusdToBurn: BigNumberish,
    currency: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  liquidatePositionMax(
    user: string,
    currency: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "liquidatePositionMax(address,bytes32)"(
    user: string,
    currency: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  markPosition(
    user: string,
    _currency: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "markPosition(address,bytes32)"(
    user: string,
    _currency: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  removeMark(
    user: string,
    _currency: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "removeMark(address,bytes32)"(
    user: string,
    _currency: BytesLike,
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

  setPrices(
    newPrices: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setPrices(address)"(
    newPrices: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  underCollateralizedMarks(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { marker: string; timestamp: BigNumber }>;

  "underCollateralizedMarks(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { marker: string; timestamp: BigNumber }>;

  callStatic: {
    BuildBurnSystem(overrides?: CallOverrides): Promise<string>;

    "BuildBurnSystem()"(overrides?: CallOverrides): Promise<string>;

    CollateralSystem(overrides?: CallOverrides): Promise<string>;

    "CollateralSystem()"(overrides?: CallOverrides): Promise<string>;

    Config(overrides?: CallOverrides): Promise<string>;

    "Config()"(overrides?: CallOverrides): Promise<string>;

    DebtSystem(overrides?: CallOverrides): Promise<string>;

    "DebtSystem()"(overrides?: CallOverrides): Promise<string>;

    LIQUIDATION_DELAY_KEY(overrides?: CallOverrides): Promise<string>;

    "LIQUIDATION_DELAY_KEY()"(overrides?: CallOverrides): Promise<string>;

    LIQUIDATION_LIQUIDATOR_REWARD_KEY(
      overrides?: CallOverrides
    ): Promise<string>;

    "LIQUIDATION_LIQUIDATOR_REWARD_KEY()"(
      overrides?: CallOverrides
    ): Promise<string>;

    LIQUIDATION_MARKER_REWARD_KEY(overrides?: CallOverrides): Promise<string>;

    "LIQUIDATION_MARKER_REWARD_KEY()"(
      overrides?: CallOverrides
    ): Promise<string>;

    LIQUIDATION_RATIO_KEY(overrides?: CallOverrides): Promise<string>;

    "LIQUIDATION_RATIO_KEY()"(overrides?: CallOverrides): Promise<string>;

    Prices(overrides?: CallOverrides): Promise<string>;

    "Prices()"(overrides?: CallOverrides): Promise<string>;

    __AdminUpgradeable_init(
      _admin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "__AdminUpgradeable_init(address)"(
      _admin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    admin(overrides?: CallOverrides): Promise<string>;

    "admin()"(overrides?: CallOverrides): Promise<string>;

    becomeAdmin(overrides?: CallOverrides): Promise<void>;

    "becomeAdmin()"(overrides?: CallOverrides): Promise<void>;

    candidate(overrides?: CallOverrides): Promise<string>;

    "candidate()"(overrides?: CallOverrides): Promise<string>;

    evalUserPosition(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        debtBalance: BigNumber;
        stakedCollateral: BigNumber;
        collateralPrice: BigNumber;
        collateralValue: BigNumber;
        collateralizedRatio: BigNumber;
      }
    >;

    "evalUserPosition(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        debtBalance: BigNumber;
        stakedCollateral: BigNumber;
        collateralPrice: BigNumber;
        collateralValue: BigNumber;
        collateralizedRatio: BigNumber;
      }
    >;

    evalUserPositionAll(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        debtBalance: BigNumber;
        stakedCollateral: BigNumber;
        collateralPrice: BigNumber;
        collateralValue: BigNumber;
        collateralizedRatio: BigNumber;
      }
    >;

    "evalUserPositionAll(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        debtBalance: BigNumber;
        stakedCollateral: BigNumber;
        collateralPrice: BigNumber;
        collateralValue: BigNumber;
        collateralizedRatio: BigNumber;
      }
    >;

    getMarkTimestamp(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getMarkTimestamp(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMarker(user: string, overrides?: CallOverrides): Promise<string>;

    "getMarker(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<string>;

    initialize(
      _BuildBurnSystem: string,
      _CollateralSystem: string,
      _Config: string,
      _DebtSystem: string,
      _Prices: string,
      _admin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "initialize(address,address,address,address,address,address)"(
      _BuildBurnSystem: string,
      _CollateralSystem: string,
      _Config: string,
      _DebtSystem: string,
      _Prices: string,
      _admin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isPositionMarked(user: string, overrides?: CallOverrides): Promise<boolean>;

    "isPositionMarked(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    liquidatePosition(
      user: string,
      fusdToBurn: BigNumberish,
      currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "liquidatePosition(address,uint256,bytes32)"(
      user: string,
      fusdToBurn: BigNumberish,
      currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    liquidatePositionMax(
      user: string,
      currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "liquidatePositionMax(address,bytes32)"(
      user: string,
      currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    markPosition(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "markPosition(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    removeMark(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "removeMark(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setCandidate(_candidate: string, overrides?: CallOverrides): Promise<void>;

    "setCandidate(address)"(
      _candidate: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setPrices(newPrices: string, overrides?: CallOverrides): Promise<void>;

    "setPrices(address)"(
      newPrices: string,
      overrides?: CallOverrides
    ): Promise<void>;

    underCollateralizedMarks(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { marker: string; timestamp: BigNumber }>;

    "underCollateralizedMarks(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { marker: string; timestamp: BigNumber }>;
  };

  filters: {
    AdminChanged(oldAdmin: null, newAdmin: null): EventFilter;

    CandidateChanged(oldCandidate: null, newCandidate: null): EventFilter;

    PositionLiquidated(
      user: null,
      marker: null,
      liquidator: null,
      debtBurnt: null,
      collateralCurrency: null,
      collateralWithdrawnFromStaked: null,
      markerReward: null,
      liquidatorReward: null
    ): EventFilter;

    PositionMarked(user: null, marker: null): EventFilter;

    PositionUnmarked(user: null): EventFilter;
  };

  estimateGas: {
    BuildBurnSystem(overrides?: CallOverrides): Promise<BigNumber>;

    "BuildBurnSystem()"(overrides?: CallOverrides): Promise<BigNumber>;

    CollateralSystem(overrides?: CallOverrides): Promise<BigNumber>;

    "CollateralSystem()"(overrides?: CallOverrides): Promise<BigNumber>;

    Config(overrides?: CallOverrides): Promise<BigNumber>;

    "Config()"(overrides?: CallOverrides): Promise<BigNumber>;

    DebtSystem(overrides?: CallOverrides): Promise<BigNumber>;

    "DebtSystem()"(overrides?: CallOverrides): Promise<BigNumber>;

    LIQUIDATION_DELAY_KEY(overrides?: CallOverrides): Promise<BigNumber>;

    "LIQUIDATION_DELAY_KEY()"(overrides?: CallOverrides): Promise<BigNumber>;

    LIQUIDATION_LIQUIDATOR_REWARD_KEY(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "LIQUIDATION_LIQUIDATOR_REWARD_KEY()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    LIQUIDATION_MARKER_REWARD_KEY(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "LIQUIDATION_MARKER_REWARD_KEY()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    LIQUIDATION_RATIO_KEY(overrides?: CallOverrides): Promise<BigNumber>;

    "LIQUIDATION_RATIO_KEY()"(overrides?: CallOverrides): Promise<BigNumber>;

    Prices(overrides?: CallOverrides): Promise<BigNumber>;

    "Prices()"(overrides?: CallOverrides): Promise<BigNumber>;

    __AdminUpgradeable_init(
      _admin: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "__AdminUpgradeable_init(address)"(
      _admin: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    "admin()"(overrides?: CallOverrides): Promise<BigNumber>;

    becomeAdmin(overrides?: Overrides): Promise<BigNumber>;

    "becomeAdmin()"(overrides?: Overrides): Promise<BigNumber>;

    candidate(overrides?: CallOverrides): Promise<BigNumber>;

    "candidate()"(overrides?: CallOverrides): Promise<BigNumber>;

    evalUserPosition(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "evalUserPosition(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    evalUserPositionAll(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "evalUserPositionAll(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMarkTimestamp(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getMarkTimestamp(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMarker(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    "getMarker(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _BuildBurnSystem: string,
      _CollateralSystem: string,
      _Config: string,
      _DebtSystem: string,
      _Prices: string,
      _admin: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "initialize(address,address,address,address,address,address)"(
      _BuildBurnSystem: string,
      _CollateralSystem: string,
      _Config: string,
      _DebtSystem: string,
      _Prices: string,
      _admin: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    isPositionMarked(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isPositionMarked(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    liquidatePosition(
      user: string,
      fusdToBurn: BigNumberish,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "liquidatePosition(address,uint256,bytes32)"(
      user: string,
      fusdToBurn: BigNumberish,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    liquidatePositionMax(
      user: string,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "liquidatePositionMax(address,bytes32)"(
      user: string,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    markPosition(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "markPosition(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    removeMark(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "removeMark(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setCandidate(_candidate: string, overrides?: Overrides): Promise<BigNumber>;

    "setCandidate(address)"(
      _candidate: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setPrices(newPrices: string, overrides?: Overrides): Promise<BigNumber>;

    "setPrices(address)"(
      newPrices: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    underCollateralizedMarks(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "underCollateralizedMarks(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    BuildBurnSystem(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "BuildBurnSystem()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    CollateralSystem(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "CollateralSystem()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    Config(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "Config()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DebtSystem(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "DebtSystem()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    LIQUIDATION_DELAY_KEY(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "LIQUIDATION_DELAY_KEY()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    LIQUIDATION_LIQUIDATOR_REWARD_KEY(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "LIQUIDATION_LIQUIDATOR_REWARD_KEY()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    LIQUIDATION_MARKER_REWARD_KEY(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "LIQUIDATION_MARKER_REWARD_KEY()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    LIQUIDATION_RATIO_KEY(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "LIQUIDATION_RATIO_KEY()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    Prices(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "Prices()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    __AdminUpgradeable_init(
      _admin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "__AdminUpgradeable_init(address)"(
      _admin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "admin()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    becomeAdmin(overrides?: Overrides): Promise<PopulatedTransaction>;

    "becomeAdmin()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    candidate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "candidate()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    evalUserPosition(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "evalUserPosition(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    evalUserPositionAll(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "evalUserPositionAll(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMarkTimestamp(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getMarkTimestamp(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMarker(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getMarker(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _BuildBurnSystem: string,
      _CollateralSystem: string,
      _Config: string,
      _DebtSystem: string,
      _Prices: string,
      _admin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "initialize(address,address,address,address,address,address)"(
      _BuildBurnSystem: string,
      _CollateralSystem: string,
      _Config: string,
      _DebtSystem: string,
      _Prices: string,
      _admin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    isPositionMarked(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isPositionMarked(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    liquidatePosition(
      user: string,
      fusdToBurn: BigNumberish,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "liquidatePosition(address,uint256,bytes32)"(
      user: string,
      fusdToBurn: BigNumberish,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    liquidatePositionMax(
      user: string,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "liquidatePositionMax(address,bytes32)"(
      user: string,
      currency: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    markPosition(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "markPosition(address,bytes32)"(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    removeMark(
      user: string,
      _currency: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "removeMark(address,bytes32)"(
      user: string,
      _currency: BytesLike,
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

    setPrices(
      newPrices: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setPrices(address)"(
      newPrices: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    underCollateralizedMarks(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "underCollateralizedMarks(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}