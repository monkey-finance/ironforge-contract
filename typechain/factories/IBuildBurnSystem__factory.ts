/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { IBuildBurnSystem } from "../IBuildBurnSystem";

export class IBuildBurnSystem__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IBuildBurnSystem {
    return new Contract(address, _abi, signerOrProvider) as IBuildBurnSystem;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_currency",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "buildFromCollateralSys",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_currency",
        type: "bytes32",
      },
    ],
    name: "burnForLiquidation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_currency",
        type: "bytes32",
      },
    ],
    name: "burnFromCollateralSys",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
