/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { AdminUpgradeable } from "../AdminUpgradeable";

export class AdminUpgradeable__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<AdminUpgradeable> {
    return super.deploy(overrides || {}) as Promise<AdminUpgradeable>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): AdminUpgradeable {
    return super.attach(address) as AdminUpgradeable;
  }
  connect(signer: Signer): AdminUpgradeable__factory {
    return super.connect(signer) as AdminUpgradeable__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AdminUpgradeable {
    return new Contract(address, _abi, signerOrProvider) as AdminUpgradeable;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldCandidate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newCandidate",
        type: "address",
      },
    ],
    name: "CandidateChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "__AdminUpgradeable_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "becomeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "candidate",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_candidate",
        type: "address",
      },
    ],
    name: "setCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506104b8806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063075a78401461005c57806307880b7f1461008457806325971dff146100aa5780636c8381f8146100b2578063f851a440146100d6575b600080fd5b6100826004803603602081101561007257600080fd5b50356001600160a01b03166100de565b005b6100826004803603602081101561009a57600080fd5b50356001600160a01b031661022c565b6100826102dd565b6100ba610387565b604080516001600160a01b039092168252519081900360200190f35b6100ba610396565b600054610100900460ff16806100f757506100f76103ab565b80610105575060005460ff16155b6101405760405162461bcd60e51b815260040180806020018281038252602e815260200180610455602e913960400191505060405180910390fd5b600054610100900460ff1615801561016b576000805460ff1961ff0019909116610100171660011790555b6001600160a01b0382166101c6576040805162461bcd60e51b815260206004820152601e60248201527f41646d696e5570677261646561626c653a207a65726f20616464726573730000604482015290519081900360640190fd5b6000805462010000600160b01b031916620100006001600160a01b03851690810291909117825560408051928352602083019190915280516000805160206103c38339815191529281900390910190a18015610228576000805461ff00191690555b5050565b6000546201000090046001600160a01b0316331461027b5760405162461bcd60e51b81526004018080602001828103825260418152602001806103e36041913960600191505060405180910390fd5b600180546001600160a01b038381166001600160a01b0319831617928390556040805192821680845293909116602083015280517f7f730391c4f0fa1bea34bcb9bff8c30a079b21a0359759160cb990648ab84c729281900390910190a15050565b6001546001600160a01b031633146103265760405162461bcd60e51b81526004018080602001828103825260318152602001806104246031913960400191505060405180910390fd5b600080546001546001600160a01b039081166201000090810262010000600160b01b03198416179384905560408051938290048316808552919094049091166020830152825190926000805160206103c3833981519152928290030190a150565b6001546001600160a01b031681565b6000546201000090046001600160a01b031681565b60006103b6306103bc565b15905090565b3b15159056fe7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f41646d696e5570677261646561626c653a206f6e6c792074686520636f6e74726163742061646d696e2063616e20706572666f726d207468697320616374696f6e41646d696e5570677261646561626c653a206f6e6c792063616e6469646174652063616e206265636f6d652061646d696e496e697469616c697a61626c653a20636f6e747261637420697320616c726561647920696e697469616c697a6564a264697066735822122062a1ed3097153af844c4158ffd04ce7beb9c8a810b180f3d186d10dc3e27b11164736f6c634300060c0033";