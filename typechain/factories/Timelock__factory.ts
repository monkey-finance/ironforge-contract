/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Timelock } from "../Timelock";

export class Timelock__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _admin: string,
    _delay: BigNumberish,
    overrides?: Overrides
  ): Promise<Timelock> {
    return super.deploy(_admin, _delay, overrides || {}) as Promise<Timelock>;
  }
  getDeployTransaction(
    _admin: string,
    _delay: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(_admin, _delay, overrides || {});
  }
  attach(address: string): Timelock {
    return super.attach(address) as Timelock;
  }
  connect(signer: Signer): Timelock__factory {
    return super.connect(signer) as Timelock__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Timelock {
    return new Contract(address, _abi, signerOrProvider) as Timelock;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_delay",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "txHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "CancelTransaction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "txHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "ExecuteTransaction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "NewAdmin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "newDelay",
        type: "uint256",
      },
    ],
    name: "NewDelay",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newPendingAdmin",
        type: "address",
      },
    ],
    name: "NewPendingAdmin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "txHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "QueueTransaction",
    type: "event",
  },
  {
    inputs: [],
    name: "GRACE_PERIOD",
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
    name: "MAXIMUM_DELAY",
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
    name: "MINIMUM_DELAY",
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
    name: "acceptAdmin",
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
    name: "admin_initialized",
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
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "cancelTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "delay",
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
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "executeTransaction",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingAdmin",
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
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "queueTransaction",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "queuedTransactions",
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
        internalType: "uint256",
        name: "_delay",
        type: "uint256",
      },
    ],
    name: "setDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pendingAdmin",
        type: "address",
      },
    ],
    name: "setPendingAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516116f03803806116f08339818101604052604081101561003357600080fd5b5080516020909101516001600055620151808110156100835760405162461bcd60e51b81526004018080602001828103825260378152602001806116b96037913960400191505060405180910390fd5b62278d008111156100c55760405162461bcd60e51b815260040180806020018281038252603b81526020018061167e603b913960400191505060405180910390fd5b600180546001600160a01b0319166001600160a01b0393909316929092179091556003556004805460ff1916905561157c806101026000396000f3fe6080604052600436106100b15760003560e01c80630825f38f146100bd5780630e18b68114610205578063267822471461021c5780633a66f9011461024d5780634dd18bf51461033f578063591fcdfe146103725780636a42b8f8146104525780636fc1f57e146104675780637d645fab14610490578063b1b43ae5146104a5578063c1a287e2146104ba578063e177246e146104cf578063f2b06537146104f9578063f851a44014610523576100b8565b366100b857005b600080fd5b610190600480360360a08110156100d357600080fd5b6001600160a01b0382351691602081013591810190606081016040820135600160201b81111561010257600080fd5b82018360208201111561011457600080fd5b803590602001918460018302840111600160201b8311171561013557600080fd5b919390929091602081019035600160201b81111561015257600080fd5b82018360208201111561016457600080fd5b803590602001918460018302840111600160201b8311171561018557600080fd5b919350915035610538565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101ca5781810151838201526020016101b2565b50505050905090810190601f1680156101f75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561021157600080fd5b5061021a610a17565b005b34801561022857600080fd5b50610231610ab6565b604080516001600160a01b039092168252519081900360200190f35b34801561025957600080fd5b5061032d600480360360a081101561027057600080fd5b6001600160a01b0382351691602081013591810190606081016040820135600160201b81111561029f57600080fd5b8201836020820111156102b157600080fd5b803590602001918460018302840111600160201b831117156102d257600080fd5b919390929091602081019035600160201b8111156102ef57600080fd5b82018360208201111561030157600080fd5b803590602001918460018302840111600160201b8311171561032257600080fd5b919350915035610ac5565b60408051918252519081900360200190f35b34801561034b57600080fd5b5061021a6004803603602081101561036257600080fd5b50356001600160a01b0316610ce6565b34801561037e57600080fd5b5061021a600480360360a081101561039557600080fd5b6001600160a01b0382351691602081013591810190606081016040820135600160201b8111156103c457600080fd5b8201836020820111156103d657600080fd5b803590602001918460018302840111600160201b831117156103f757600080fd5b919390929091602081019035600160201b81111561041457600080fd5b82018360208201111561042657600080fd5b803590602001918460018302840111600160201b8311171561044757600080fd5b919350915035610ddb565b34801561045e57600080fd5b5061032d610fa5565b34801561047357600080fd5b5061047c610fab565b604080519115158252519081900360200190f35b34801561049c57600080fd5b5061032d610fb4565b3480156104b157600080fd5b5061032d610fbb565b3480156104c657600080fd5b5061032d610fc2565b3480156104db57600080fd5b5061021a600480360360208110156104f257600080fd5b5035610fc9565b34801561050557600080fd5b5061047c6004803603602081101561051c57600080fd5b50356110be565b34801561052f57600080fd5b506102316110d3565b606060026000541415610592576040805162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015290519081900360640190fd5b60026000556001546001600160a01b031633146105e05760405162461bcd60e51b815260040180806020018281038252603881526020018061125c6038913960400191505060405180910390fd5b60008888888888888860405160200180886001600160a01b0316815260200187815260200180602001806020018481526020018381038352888882818152602001925080828437600083820152601f01601f191690910184810383528681526020019050868680828437600081840181905260408051601f19601f90940184169095018581039093018552918252835160209485012080825260059094522054919c505060ff1699506106ce985050505050505050505760405162461bcd60e51b815260040180806020018281038252603d8152602001806113ea603d913960400191505060405180910390fd5b826106d76110e2565b10156107145760405162461bcd60e51b81526004018080602001828103825260458152602001806112fe6045913960600191505060405180910390fd5b61072183621275006110e6565b6107296110e2565b11156107665760405162461bcd60e51b81526004018080602001828103825260338152602001806112cb6033913960400191505060405180910390fd5b6000818152600560205260409020805460ff191690556060866107c25785858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092935061081d92505050565b878760405180838380828437604051920182900382206001600160e01b03198116602084019081529095508b94508a935091602401905083838082843780830192505050935050505060405160208183030381529060405290505b600060608b6001600160a01b03168b846040518082805190602001908083835b6020831061085c5780518252601f19909201916020918201910161083d565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146108be576040519150601f19603f3d011682016040523d82523d6000602084013e6108c3565b606091505b5091509150816108d282611145565b9061095b5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610920578181015183820152602001610908565b50505050905090810190601f16801561094d5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b508b6001600160a01b0316847fa560e3198060a2f10670c1ec5b403077ea6ae93ca8de1c32b451dc1a943cd6e78d8d8d8d8d8d6040518087815260200180602001806020018481526020018381038352888882818152602001925080828437600083820152601f01601f191690910184810383528681526020019050868680828437600083820152604051601f909101601f19169092018290039a509098505050505050505050a360016000559b9a5050505050505050505050565b6002546001600160a01b03163314610a605760405162461bcd60e51b81526004018080602001828103825260388152602001806114276038913960400191505060405180910390fd5b60018054336001600160a01b031991821617918290556002805490911690556040516001600160a01b03909116907f71614071b88dee5e0b2ae578a9dd7b2ebbe9ae832ba419dc0242cd065a290b6c90600090a2565b6002546001600160a01b031681565b6001546000906001600160a01b03163314610b115760405162461bcd60e51b81526004018080602001828103825260368152602001806114976036913960400191505060405180910390fd5b610b25600354610b1f6110e2565b906110e6565b821015610b635760405162461bcd60e51b81526004018080602001828103825260498152602001806114cd6049913960600191505060405180910390fd5b60008888888888888860405160200180886001600160a01b0316815260200187815260200180602001806020018481526020018381038352888882818152602001925080828437600083820152601f01601f191690910184810383528681526020019050868680828437600081840152601f19601f820116905080830192505050995050505050505050505060405160208183030381529060405280519060200120905060016005600083815260200190815260200160002060006101000a81548160ff021916908315150217905550886001600160a01b0316817f76e2796dc3a81d57b0e8504b647febcbeeb5f4af818e164f11eef8131a6a763f8a8a8a8a8a8a6040518087815260200180602001806020018481526020018381038352888882818152602001925080828437600083820152601f01601f191690910184810383528681526020019050868680828437600083820152604051601f909101601f19169092018290039a509098505050505050505050a398975050505050505050565b60045460ff1615610d3457333014610d2f5760405162461bcd60e51b815260040180806020018281038252603881526020018061145f6038913960400191505060405180910390fd5b610d8b565b6001546001600160a01b03163314610d7d5760405162461bcd60e51b815260040180806020018281038252603b815260200180611377603b913960400191505060405180910390fd5b6004805460ff191660011790555b600280546001600160a01b0319166001600160a01b0383811691909117918290556040519116907f69d78e38a01985fbb1462961809b4b2d65531bc93b2b94037f3334b82ca4a75690600090a250565b6001546001600160a01b03163314610e245760405162461bcd60e51b81526004018080602001828103825260378152602001806112946037913960400191505060405180910390fd5b60008787878787878760405160200180886001600160a01b0316815260200187815260200180602001806020018481526020018381038352888882818152602001925080828437600083820152601f01601f191690910184810383528681526020019050868680828437600081840152601f19601f820116905080830192505050995050505050505050505060405160208183030381529060405280519060200120905060006005600083815260200190815260200160002060006101000a81548160ff021916908315150217905550876001600160a01b0316817f2fffc091a501fd91bfbff27141450d3acb40fb8e6d8382b243ec7a812a3aaf878989898989896040518087815260200180602001806020018481526020018381038352888882818152602001925080828437600083820152601f01601f191690910184810383528681526020019050868680828437600083820152604051601f909101601f19169092018290039a509098505050505050505050a35050505050505050565b60035481565b60045460ff1681565b62278d0081565b6201518081565b6212750081565b3330146110075760405162461bcd60e51b81526004018080602001828103825260318152602001806115166031913960400191505060405180910390fd5b620151808110156110495760405162461bcd60e51b81526004018080602001828103825260348152602001806113436034913960400191505060405180910390fd5b62278d0081111561108b5760405162461bcd60e51b81526004018080602001828103825260388152602001806113b26038913960400191505060405180910390fd5b600381905560405181907f948b1f6a42ee138b7e34058ba85a37f716d55ff25ff05a763f15bed6a04c8d2c90600090a250565b60056020526000908152604090205460ff1681565b6001546001600160a01b031681565b4290565b60008282018381101561113e576040805162461bcd60e51b815260206004820152601b60248201527a536166654d6174683a206164646974696f6e206f766572666c6f7760281b604482015290519081900360640190fd5b9392505050565b606060448251101561118b575060408051808201909152601d81527f5472616e73616374696f6e2072657665727465642073696c656e746c790000006020820152611256565b60048201805190926024019060208110156111a557600080fd5b8101908080516040519392919084600160201b8211156111c457600080fd5b9083019060208201858111156111d957600080fd5b8251600160201b8111828201881017156111f257600080fd5b82525081516020918201929091019080838360005b8381101561121f578181015183820152602001611207565b50505050905090810190601f16801561124c5780820380516001836020036101000a031916815260200191505b5060405250505090505b91905056fe54696d656c6f636b3a3a657865637574655472616e73616374696f6e3a2043616c6c206d75737420636f6d652066726f6d2061646d696e2e54696d656c6f636b3a3a63616e63656c5472616e73616374696f6e3a2043616c6c206d75737420636f6d652066726f6d2061646d696e2e54696d656c6f636b3a3a657865637574655472616e73616374696f6e3a205472616e73616374696f6e206973207374616c652e54696d656c6f636b3a3a657865637574655472616e73616374696f6e3a205472616e73616374696f6e206861736e2774207375727061737365642074696d65206c6f636b2e54696d656c6f636b3a3a73657444656c61793a2044656c6179206d75737420657863656564206d696e696d756d2064656c61792e54696d656c6f636b3a3a73657450656e64696e6741646d696e3a2046697273742063616c6c206d75737420636f6d652066726f6d2061646d696e2e54696d656c6f636b3a3a73657444656c61793a2044656c6179206d757374206e6f7420657863656564206d6178696d756d2064656c61792e54696d656c6f636b3a3a657865637574655472616e73616374696f6e3a205472616e73616374696f6e206861736e2774206265656e207175657565642e54696d656c6f636b3a3a61636365707441646d696e3a2043616c6c206d75737420636f6d652066726f6d2070656e64696e6741646d696e2e54696d656c6f636b3a3a73657450656e64696e6741646d696e3a2043616c6c206d75737420636f6d652066726f6d2054696d656c6f636b2e54696d656c6f636b3a3a71756575655472616e73616374696f6e3a2043616c6c206d75737420636f6d652066726f6d2061646d696e2e54696d656c6f636b3a3a71756575655472616e73616374696f6e3a20457374696d6174656420657865637574696f6e20626c6f636b206d75737420736174697366792064656c61792e54696d656c6f636b3a3a73657444656c61793a2043616c6c206d75737420636f6d652066726f6d2054696d656c6f636b2ea264697066735822122077b767ec750c622ceb00d3b361964c29e6e287532c6a6f62f3ba82f2e0a1484b64736f6c634300060c003354696d656c6f636b3a3a636f6e7374727563746f723a2044656c6179206d757374206e6f7420657863656564206d6178696d756d2064656c61792e54696d656c6f636b3a3a636f6e7374727563746f723a2044656c6179206d75737420657863656564206d696e696d756d2064656c61792e";