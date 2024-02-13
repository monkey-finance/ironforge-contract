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
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface PublicSafeDecimalMathInterface extends ethers.utils.Interface {
  functions: {
    "decimalToPreciseDecimal(uint256)": FunctionFragment;
    "divideDecimal(uint256,uint256)": FunctionFragment;
    "divideDecimalRound(uint256,uint256)": FunctionFragment;
    "divideDecimalRoundPrecise(uint256,uint256)": FunctionFragment;
    "multiplyDecimal(uint256,uint256)": FunctionFragment;
    "multiplyDecimalRound(uint256,uint256)": FunctionFragment;
    "multiplyDecimalRoundPrecise(uint256,uint256)": FunctionFragment;
    "preciseDecimalToDecimal(uint256)": FunctionFragment;
    "preciseUnit()": FunctionFragment;
    "unit()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "decimalToPreciseDecimal",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "divideDecimal",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "divideDecimalRound",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "divideDecimalRoundPrecise",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "multiplyDecimal",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "multiplyDecimalRound",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "multiplyDecimalRoundPrecise",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "preciseDecimalToDecimal",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "preciseUnit",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "unit", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "decimalToPreciseDecimal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "divideDecimal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "divideDecimalRound",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "divideDecimalRoundPrecise",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "multiplyDecimal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "multiplyDecimalRound",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "multiplyDecimalRoundPrecise",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "preciseDecimalToDecimal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "preciseUnit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unit", data: BytesLike): Result;

  events: {};
}

export class PublicSafeDecimalMath extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: PublicSafeDecimalMathInterface;

  functions: {
    decimalToPreciseDecimal(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "decimalToPreciseDecimal(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    divideDecimal(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "divideDecimal(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    divideDecimalRound(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "divideDecimalRound(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    divideDecimalRoundPrecise(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "divideDecimalRoundPrecise(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    multiplyDecimal(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "multiplyDecimal(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    multiplyDecimalRound(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "multiplyDecimalRound(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    multiplyDecimalRoundPrecise(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "multiplyDecimalRoundPrecise(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    preciseDecimalToDecimal(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "preciseDecimalToDecimal(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    preciseUnit(overrides?: CallOverrides): Promise<[BigNumber]>;

    "preciseUnit()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    unit(overrides?: CallOverrides): Promise<[BigNumber]>;

    "unit()"(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  decimalToPreciseDecimal(
    i: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "decimalToPreciseDecimal(uint256)"(
    i: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  divideDecimal(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "divideDecimal(uint256,uint256)"(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  divideDecimalRound(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "divideDecimalRound(uint256,uint256)"(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  divideDecimalRoundPrecise(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "divideDecimalRoundPrecise(uint256,uint256)"(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  multiplyDecimal(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "multiplyDecimal(uint256,uint256)"(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  multiplyDecimalRound(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "multiplyDecimalRound(uint256,uint256)"(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  multiplyDecimalRoundPrecise(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "multiplyDecimalRoundPrecise(uint256,uint256)"(
    x: BigNumberish,
    y: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  preciseDecimalToDecimal(
    i: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "preciseDecimalToDecimal(uint256)"(
    i: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  preciseUnit(overrides?: CallOverrides): Promise<BigNumber>;

  "preciseUnit()"(overrides?: CallOverrides): Promise<BigNumber>;

  unit(overrides?: CallOverrides): Promise<BigNumber>;

  "unit()"(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    decimalToPreciseDecimal(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "decimalToPreciseDecimal(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    divideDecimal(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "divideDecimal(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    divideDecimalRound(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "divideDecimalRound(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    divideDecimalRoundPrecise(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "divideDecimalRoundPrecise(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    multiplyDecimal(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "multiplyDecimal(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    multiplyDecimalRound(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "multiplyDecimalRound(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    multiplyDecimalRoundPrecise(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "multiplyDecimalRoundPrecise(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    preciseDecimalToDecimal(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "preciseDecimalToDecimal(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    preciseUnit(overrides?: CallOverrides): Promise<BigNumber>;

    "preciseUnit()"(overrides?: CallOverrides): Promise<BigNumber>;

    unit(overrides?: CallOverrides): Promise<BigNumber>;

    "unit()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    decimalToPreciseDecimal(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "decimalToPreciseDecimal(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    divideDecimal(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "divideDecimal(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    divideDecimalRound(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "divideDecimalRound(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    divideDecimalRoundPrecise(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "divideDecimalRoundPrecise(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    multiplyDecimal(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "multiplyDecimal(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    multiplyDecimalRound(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "multiplyDecimalRound(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    multiplyDecimalRoundPrecise(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "multiplyDecimalRoundPrecise(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    preciseDecimalToDecimal(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "preciseDecimalToDecimal(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    preciseUnit(overrides?: CallOverrides): Promise<BigNumber>;

    "preciseUnit()"(overrides?: CallOverrides): Promise<BigNumber>;

    unit(overrides?: CallOverrides): Promise<BigNumber>;

    "unit()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    decimalToPreciseDecimal(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "decimalToPreciseDecimal(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    divideDecimal(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "divideDecimal(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    divideDecimalRound(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "divideDecimalRound(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    divideDecimalRoundPrecise(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "divideDecimalRoundPrecise(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    multiplyDecimal(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "multiplyDecimal(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    multiplyDecimalRound(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "multiplyDecimalRound(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    multiplyDecimalRoundPrecise(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "multiplyDecimalRoundPrecise(uint256,uint256)"(
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    preciseDecimalToDecimal(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "preciseDecimalToDecimal(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    preciseUnit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "preciseUnit()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    unit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "unit()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
