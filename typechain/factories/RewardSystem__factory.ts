/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { RewardSystem } from "../RewardSystem";

export class RewardSystem__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<RewardSystem> {
    return super.deploy(overrides || {}) as Promise<RewardSystem>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): RewardSystem {
    return super.attach(address) as RewardSystem;
  }
  connect(signer: Signer): RewardSystem__factory {
    return super.connect(signer) as RewardSystem__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RewardSystem {
    return new Contract(address, _abi, signerOrProvider) as RewardSystem;
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "periodId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeReward",
        type: "uint256",
      },
    ],
    name: "RewardClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldSigner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newSigner",
        type: "address",
      },
    ],
    name: "RewardSignerChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
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
    inputs: [],
    name: "PERIOD_LENGTH",
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
    inputs: [],
    name: "REWARD_TYPEHASH",
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
        internalType: "uint256",
        name: "periodId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeReward",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "periodId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "feeReward",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "claimRewardFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collateralSystem",
    outputs: [
      {
        internalType: "contract ICollateralSystem",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "firstPeriodStartTime",
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
    inputs: [],
    name: "fusd",
    outputs: [
      {
        internalType: "contract IERC20Upgradeable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentPeriodId",
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
        internalType: "uint256",
        name: "periodId",
        type: "uint256",
      },
    ],
    name: "getPeriodEndTime",
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
        internalType: "uint256",
        name: "periodId",
        type: "uint256",
      },
    ],
    name: "getPeriodStartTime",
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
        internalType: "uint256",
        name: "_firstPeriodStartTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_rewardSigner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_fusdAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_collateralSystemAddress",
        type: "address",
      },
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
    inputs: [],
    name: "rewardSigner",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardSigner",
        type: "address",
      },
    ],
    name: "setRewardSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userLastClaimPeriodIds",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611420806100206000396000f3fe608060405234801561001057600080fd5b50600436106100fc5760003560e01c8063075a78401461010157806307880b7f14610129578063097266dc1461014f57806321f4808e1461017e57806325971dff146101a2578063323f24ab146101aa5780633641e083146101b25780633644e515146101f6578063396b6247146101fe578063514edb20146102065780635c09e7ac146102905780636c8381f8146102ad57806376618f27146102b55780639566b6a71461032f578063ae5dbee814610337578063c69d65d11461033f578063d31bc57d14610365578063e7a891b91461038b578063f851a44014610393578063fb01e4e11461039b575b600080fd5b6101276004803603602081101561011757600080fd5b50356001600160a01b03166103a3565b005b6101276004803603602081101561013f57600080fd5b50356001600160a01b03166104f1565b61016c6004803603602081101561016557600080fd5b50356105a2565b60408051918252519081900360200190f35b61018661060c565b604080516001600160a01b039092168252519081900360200190f35b61012761061b565b6101866106c5565b610127600480360360a08110156101c857600080fd5b508035906001600160a01b0360208201358116916040810135821691606082013581169160800135166106d4565b61016c610900565b61016c610906565b6101276004803603608081101561021c57600080fd5b8135916001600160a01b036020820135169160408201359190810190608081016060820135600160201b81111561025257600080fd5b82018360208201111561026457600080fd5b803590602001918460018302840111600160201b8311171561028557600080fd5b509092509050610962565b61016c600480360360208110156102a657600080fd5b5035610976565b6101866109c6565b610127600480360360608110156102cb57600080fd5b813591602081013591810190606081016040820135600160201b8111156102f157600080fd5b82018360208201111561030357600080fd5b803590602001918460018302840111600160201b8311171561032457600080fd5b5090925090506109d5565b6101866109e8565b61016c6109f7565b6101276004803603602081101561035557600080fd5b50356001600160a01b03166109fd565b61016c6004803603602081101561037b57600080fd5b50356001600160a01b0316610a58565b61016c610a6a565b610186610a71565b61016c610a86565b600054610100900460ff16806103bc57506103bc610a98565b806103ca575060005460ff16155b6104055760405162461bcd60e51b815260040180806020018281038252602e815260200180611310602e913960400191505060405180910390fd5b600054610100900460ff16158015610430576000805460ff1961ff0019909116610100171660011790555b6001600160a01b03821661048b576040805162461bcd60e51b815260206004820152601e60248201527f41646d696e5570677261646561626c653a207a65726f20616464726573730000604482015290519081900360640190fd5b6000805462010000600160b01b031916620100006001600160a01b03851690810291909117825560408051928352602083019190915280516000805160206112348339815191529281900390910190a180156104ed576000805461ff00191690555b5050565b6000546201000090046001600160a01b031633146105405760405162461bcd60e51b81526004018080602001828103825260418152602001806112546041913960600191505060405180910390fd5b600180546001600160a01b038381166001600160a01b0319831617928390556040805192821680845293909116602083015280517f7f730391c4f0fa1bea34bcb9bff8c30a079b21a0359759160cb990648ab84c729281900390910190a15050565b60008082116105e25760405162461bcd60e51b81526004018080602001828103825260288152602001806112e86028913960400191505060405180910390fd5b6106066105fd62093a806105f7856001610aa9565b90610b06565b60325490610b66565b92915050565b6036546001600160a01b031681565b6001546001600160a01b031633146106645760405162461bcd60e51b81526004018080602001828103825260318152602001806112956031913960400191505060405180910390fd5b600080546001546001600160a01b039081166201000090810262010000600160b01b0319841617938490556040805193829004831680855291909404909116602083015282519092600080516020611234833981519152928290030190a150565b6033546001600160a01b031681565b600054610100900460ff16806106ed57506106ed610a98565b806106fb575060005460ff16155b6107365760405162461bcd60e51b815260040180806020018281038252602e815260200180611310602e913960400191505060405180910390fd5b600054610100900460ff16158015610761576000805460ff1961ff0019909116610100171660011790555b61076a826103a3565b603286905561077885610bbe565b6001600160a01b0384161580159061079857506001600160a01b03831615155b6107e6576040805162461bcd60e51b815260206004820152601a60248201527952657761726453797374656d3a207a65726f206164647265737360301b604482015290519081900360640190fd5b603580546001600160a01b038087166001600160a01b0319928316179092556036805492861692909116919091179055604080518082018252600981526849726f6e466f72676560b81b6020918201528151808301835260018152603160f81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818301527f5c7c58790fc2443bf3b9cc7c82e0e971ddb5631c7ddfe4acc4ef45fd9f12e811818401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a0808301919091528351808303909101815260c0909101909252815191012060375580156108f8576000805461ff00191690555b505050505050565b60375481565b60006032544210156109495760405162461bcd60e51b81526004018080602001828103825260268152602001806113c56026913960400191505060405180910390fd5b62093a8060325442038161095957fe5b04600101905090565b61096f8585858585610cdb565b5050505050565b60008082116109b65760405162461bcd60e51b81526004018080602001828103825260288152602001806112e86028913960400191505060405180910390fd5b6106066105fd8362093a80610b06565b6001546001600160a01b031681565b6109e28433858585610cdb565b50505050565b6035546001600160a01b031681565b60325481565b6000546201000090046001600160a01b03163314610a4c5760405162461bcd60e51b81526004018080602001828103825260418152602001806112546041913960600191505060405180910390fd5b610a5581610bbe565b50565b60346020526000908152604090205481565b62093a8081565b6000546201000090046001600160a01b031681565b6000805160206113a583398151915281565b6000610aa33061103e565b15905090565b600082821115610b00576040805162461bcd60e51b815260206004820152601e60248201527f536166654d6174683a207375627472616374696f6e206f766572666c6f770000604482015290519081900360640190fd5b50900390565b600082610b1557506000610606565b82820282848281610b2257fe5b0414610b5f5760405162461bcd60e51b81526004018080602001828103825260218152602001806113606021913960400191505060405180910390fd5b9392505050565b600082820183811015610b5f576040805162461bcd60e51b815260206004820152601b60248201527a536166654d6174683a206164646974696f6e206f766572666c6f7760281b604482015290519081900360640190fd5b6001600160a01b038116610c16576040805162461bcd60e51b815260206004820152601a60248201527952657761726453797374656d3a207a65726f206164647265737360301b604482015290519081900360640190fd5b6033546001600160a01b0382811691161415610c79576040805162461bcd60e51b815260206004820181905260248201527f52657761726453797374656d3a207369676e6572206e6f74206368616e676564604482015290519081900360640190fd5b603380546001600160a01b038381166001600160a01b0319831617928390556040805192821680845293909116602083015280517f7734c964fc4f12db1f0c6f1b44af0af3e1d3c1b59240db11841aebb0bc006a939281900390910190a15050565b60008511610d1a5760405162461bcd60e51b81526004018080602001828103825260288152602001806112e86028913960400191505060405180910390fd5b60008311610d6f576040805162461bcd60e51b815260206004820152601e60248201527f52657761726453797374656d3a206e6f7468696e6720746f20636c61696d0000604482015290519081900360640190fd5b6000610d79610906565b9050808610610dcf576040805162461bcd60e51b815260206004820152601e60248201527f52657761726453797374656d3a20706572696f64206e6f7420656e6465640000604482015290519081900360640190fd5b6001600160a01b0385166000908152603460205260409020548611610e255760405162461bcd60e51b81526004018080602001828103825260248152602001806113816024913960400191505060405180910390fd5b6001600160a01b03851660008181526034602090815260408083208a905560375481516000805160206113a5833981519152818501528083018c9052606081019590955260808086018a90528251808703909101815260a08601835280519084012061190160f01b60c087015260c286019190915260e280860191909152815180860390910181526101028501808352815191840191909120610122601f8901859004909402860184019092528681529093610efd928891889182910183828082843760009201919091525086939250506110449050565b6033549091506001600160a01b03808316911614610f62576040805162461bcd60e51b815260206004820152601f60248201527f52657761726453797374656d3a20696e76616c6964207369676e617475726500604482015290519081900360640190fd5b8515610feb576035546040805163a9059cbb60e01b81526001600160a01b038a81166004830152602482018a90529151919092169163a9059cbb9160448083019260209291908290030181600087803b158015610fbe57600080fd5b505af1158015610fd2573d6000803e3d6000fd5b505050506040513d6020811015610fe857600080fd5b50505b604080516001600160a01b0389168152602081018a905280820188905290517ff01da32686223933d8a18a391060918c7f11a3648639edd87ae013e2e27317439181900360600190a15050505050505050565b3b151590565b6000815160411461109c576040805162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015290519081900360640190fd5b60208201516040830151606084015160001a6110ba868285856110c4565b9695505050505050565b60006fa2a8918ca85bafe22016d0b997e4df60600160ff1b0382111561111b5760405162461bcd60e51b81526004018080602001828103825260228152602001806112c66022913960400191505060405180910390fd5b8360ff16601b148061113057508360ff16601c145b61116b5760405162461bcd60e51b815260040180806020018281038252602281526020018061133e6022913960400191505060405180910390fd5b600060018686868660405160008152602001604052604051808581526020018460ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa1580156111c7573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661122a576040805162461bcd60e51b815260206004820152601860248201527745434453413a20696e76616c6964207369676e617475726560401b604482015290519081900360640190fd5b9594505050505056fe7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f41646d696e5570677261646561626c653a206f6e6c792074686520636f6e74726163742061646d696e2063616e20706572666f726d207468697320616374696f6e41646d696e5570677261646561626c653a206f6e6c792063616e6469646174652063616e206265636f6d652061646d696e45434453413a20696e76616c6964207369676e6174757265202773272076616c756552657761726453797374656d3a20706572696f64204944206d75737420626520706f736974697665496e697469616c697a61626c653a20636f6e747261637420697320616c726561647920696e697469616c697a656445434453413a20696e76616c6964207369676e6174757265202776272076616c7565536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f7752657761726453797374656d3a2072657761726420616c726561647920636c61696d6564982017292251c0171bf4bdb3493cb45b96672916378da14aad0d07bfba052c4f52657761726453797374656d3a20666972737420706572696f64206e6f742073746172746564a2646970667358221220788f6d9ed99d982330db589599b737ec0d6df100f0919b0aca158db63fc21a6264736f6c634300060c0033";
