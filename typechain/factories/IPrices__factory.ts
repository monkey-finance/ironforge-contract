/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { IPrices } from "../IPrices";

export class IPrices__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPrices {
    return new Contract(address, _abi, signerOrProvider) as IPrices;
  }
}

const _abi = [
  {
    inputs: [],
    name: "FUSD",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "sourceKey",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "sourceAmount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "destKey",
        type: "bytes32",
      },
    ],
    name: "exchange",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "currencyKey",
        type: "bytes32",
      },
    ],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "currencyKey",
        type: "bytes32",
      },
    ],
    name: "isFrozen",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "currencyKey",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "frozen",
        type: "bool",
      },
    ],
    name: "setFrozen",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
