/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { QuarterlyContractOracle } from "../QuarterlyContractOracle";

export class QuarterlyContractOracle__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<QuarterlyContractOracle> {
    return super.deploy(overrides || {}) as Promise<QuarterlyContractOracle>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): QuarterlyContractOracle {
    return super.attach(address) as QuarterlyContractOracle;
  }
  connect(signer: Signer): QuarterlyContractOracle__factory {
    return super.connect(signer) as QuarterlyContractOracle__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): QuarterlyContractOracle {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as QuarterlyContractOracle;
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
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "CachedAddressUpdated",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "symbol",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "PriceUpdated",
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
        internalType: "bytes32",
        name: "symbol",
        type: "bytes32",
      },
    ],
    name: "getQuarterlyContractPrice",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updateTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "frozen",
            type: "bool",
          },
        ],
        internalType: "struct IQuarterlyContractOracle.PriceData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isOracleServerRole",
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
        name: "",
        type: "bytes32",
      },
    ],
    name: "prices",
    outputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updateTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "frozen",
        type: "bool",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "currencyKey",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "isFrozen",
        type: "bool",
      },
    ],
    name: "setFrozen",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "symbol",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "setQuarterlyContractPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IAddressStorage",
        name: "_addressStorage",
        type: "address",
      },
    ],
    name: "updateAddressCache",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610ce8806100206000396000f3fe608060405234801561001057600080fd5b50600436106100af5760003560e01c806302904164146100b4578063075a7840146100dd57806307880b7f146100f2578063238afcc51461010557806325971dff146101255780632c4804301461012d5780635a5f14c81461014057806360846bc6146101535780636c8381f8146101755780637264a0361461018a57806398e5a5ba1461019d578063c4d66de8146101b0578063f851a440146101c3575b600080fd5b6100c76100c2366004610921565b6101cb565b6040516100d49190610c31565b60405180910390f35b6100f06100eb3660046108c6565b610211565b005b6100f06101003660046108c6565b61030c565b610118610113366004610921565b61039d565b6040516100d491906109c1565b6100f06103b5565b61011861013b3660046108c6565b610441565b6100f061014e3660046108c6565b6104da565b610166610161366004610921565b6105d2565b6040516100d493929190610c54565b61017d6105f6565b6040516100d49190610993565b6100f0610198366004610939565b610605565b6100f06101ab366004610968565b610684565b6100f06101be3660046108c6565b6107eb565b61017d610877565b6101d36108a3565b506000908152603260209081526040918290208251606081018452815481526001820154928101929092526002015460ff1615159181019190915290565b600054610100900460ff168061022a575061022a61088c565b80610238575060005460ff16155b61025d5760405162461bcd60e51b815260040161025490610b37565b60405180910390fd5b600054610100900460ff16158015610288576000805460ff1961ff0019909116610100171660011790555b6001600160a01b0382166102ae5760405162461bcd60e51b815260040161025490610aaf565b6000805462010000600160b01b031916620100006001600160a01b03851602178155604051600080516020610c93833981519152916102ee9185906109a7565b60405180910390a18015610308576000805461ff00191690555b5050565b6000546201000090046001600160a01b0316331461033c5760405162461bcd60e51b8152600401610254906109f9565b600180546001600160a01b038381166001600160a01b031983161792839055604051918116927f7f730391c4f0fa1bea34bcb9bff8c30a079b21a0359759160cb990648ab84c729261039192859216906109a7565b60405180910390a15050565b60009081526032602052604090206002015460ff1690565b6001546001600160a01b031633146103df5760405162461bcd60e51b815260040161025490610ae6565b600080546001546001600160a01b039081166201000090810262010000600160b01b03198416179384905560405192819004821693600080516020610c9383398151915293610436938693909204909116906109a7565b60405180910390a150565b603354604051632474521560e21b81526000916001600160a01b0316906391d1485490610484906c27a920a1a622afa9a2a92b22a960991b9086906004016109cc565b60206040518083038186803b15801561049c57600080fd5b505afa1580156104b0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104d49190610905565b92915050565b6000546201000090046001600160a01b0316331461050a5760405162461bcd60e51b8152600401610254906109f9565b604051633b4488ed60e11b81526001600160a01b0382169063768911da9061053490600401610be3565b60206040518083038186803b15801561054c57600080fd5b505afa158015610560573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061058491906108e9565b603380546001600160a01b0319166001600160a01b0392831617908190556040517f17b158864f8c520aff3282c940ec6a731d26235b9b00b651c0dd1dafb3170f5f92610436921690610bb9565b60326020526000908152604090208054600182015460029092015490919060ff1683565b6001546001600160a01b031681565b61060d6108a3565b5060008281526032602081815260408084208151606080820184528254825260018301805483870190815260028501805460ff81161515868901528751948501885294518452905183880190815299151595830195865299909752949093529251909255925190915551151560ff19909116179055565b603354604051632474521560e21b81526001600160a01b03909116906391d14854906106c6906c27a920a1a622afa9a2a92b22a960991b9033906004016109cc565b60206040518083038186803b1580156106de57600080fd5b505afa1580156106f2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107169190610905565b6107325760405162461bcd60e51b815260040161025490610a60565b61073b8361039d565b156107585760405162461bcd60e51b815260040161025490610b85565b6107606108a3565b5060408051606081018252838152602080820184815260008385018181528882526032909352849020835181559051600182015590516002909101805460ff191691151591909117905590517fbcd10d64fce9dcf9568572ed92e371df336d32649e8960a045c9548794a44b26906107dd908690869086906109e3565b60405180910390a150505050565b600054610100900460ff1680610804575061080461088c565b80610812575060005460ff16155b61082e5760405162461bcd60e51b815260040161025490610b37565b600054610100900460ff16158015610859576000805460ff1961ff0019909116610100171660011790555b61086282610211565b8015610308576000805461ff00191690555050565b6000546201000090046001600160a01b031681565b60006108973061089d565b15905090565b3b151590565b604051806060016040528060008152602001600081526020016000151581525090565b6000602082840312156108d7578081fd5b81356108e281610c6c565b9392505050565b6000602082840312156108fa578081fd5b81516108e281610c6c565b600060208284031215610916578081fd5b81516108e281610c84565b600060208284031215610932578081fd5b5035919050565b6000806040838503121561094b578081fd5b82359150602083013561095d81610c84565b809150509250929050565b60008060006060848603121561097c578081fd5b505081359360208301359350604090920135919050565b6001600160a01b0391909116815260200190565b6001600160a01b0392831681529116602082015260400190565b901515815260200190565b9182526001600160a01b0316602082015260400190565b9283526020830191909152604082015260600190565b60208082526041908201527f41646d696e5570677261646561626c653a206f6e6c792074686520636f6e747260408201527f6163742061646d696e2063616e20706572666f726d207468697320616374696f6060820152603760f91b608082015260a00190565b6020808252602f908201527f517561727465726c79436f6e74726163744f7261636c653a206e6f74204f524160408201526e434c455f53455256455220726f6c6560881b606082015260800190565b6020808252601e908201527f41646d696e5570677261646561626c653a207a65726f20616464726573730000604082015260600190565b60208082526031908201527f41646d696e5570677261646561626c653a206f6e6c792063616e6469646174656040820152701031b0b7103132b1b7b6b29030b236b4b760791b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b6020808252601a908201527927b930b1b632a937baba32b91d10383934b1b290333937bd32b760311b604082015260600190565b6c1058d8d95cdcd0dbdb9d1c9bdb609a1b81526001600160a01b0391909116602082015260400190565b6c1058d8d95cdcd0dbdb9d1c9bdb609a1b8152604060208201819052601f908201527f416363657373436f6e74726f6c2061646472657373206e6f742076616c696400606082015260800190565b815181526020808301519082015260409182015115159181019190915260600190565b92835260208301919091521515604082015260600190565b6001600160a01b0381168114610c8157600080fd5b50565b8015158114610c8157600080fdfe7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798fa2646970667358221220c0298e8548a900073d0c83788019a926a8c2cda90be7b2bc2be1c5f1d8a2d3da64736f6c634300060c0033";
