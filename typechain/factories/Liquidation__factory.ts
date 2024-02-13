/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Liquidation } from "../Liquidation";

export class Liquidation__factory extends ContractFactory {
  constructor(
    linkLibraryAddresses: LiquidationLibraryAddresses,
    signer?: Signer
  ) {
    super(
      _abi,
      Liquidation__factory.linkBytecode(linkLibraryAddresses),
      signer
    );
  }

  static linkBytecode(
    linkLibraryAddresses: LiquidationLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$1cc4d8ad35c4e5444e1120de58c2894ed7\\$__", "g"),
      linkLibraryAddresses["__$1cc4d8ad35c4e5444e1120de58c2894ed7$__"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  deploy(overrides?: Overrides): Promise<Liquidation> {
    return super.deploy(overrides || {}) as Promise<Liquidation>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Liquidation {
    return super.attach(address) as Liquidation;
  }
  connect(signer: Signer): Liquidation__factory {
    return super.connect(signer) as Liquidation__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Liquidation {
    return new Contract(address, _abi, signerOrProvider) as Liquidation;
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
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "marker",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "liquidator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "debtBurnt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "collateralCurrency",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralWithdrawnFromStaked",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "markerReward",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidatorReward",
        type: "uint256",
      },
    ],
    name: "PositionLiquidated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "marker",
        type: "address",
      },
    ],
    name: "PositionMarked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "PositionUnmarked",
    type: "event",
  },
  {
    inputs: [],
    name: "BuildBurnSystem",
    outputs: [
      {
        internalType: "contract IBuildBurnSystem",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CollateralSystem",
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
    name: "Config",
    outputs: [
      {
        internalType: "contract IConfig",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DebtSystem",
    outputs: [
      {
        internalType: "contract IDebtSystem",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LIQUIDATION_DELAY_KEY",
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
    name: "LIQUIDATION_LIQUIDATOR_REWARD_KEY",
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
    name: "LIQUIDATION_MARKER_REWARD_KEY",
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
    name: "LIQUIDATION_RATIO_KEY",
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
    name: "Prices",
    outputs: [
      {
        internalType: "contract IPrices",
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
        name: "user",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_currency",
        type: "bytes32",
      },
    ],
    name: "evalUserPosition",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "debtBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakedCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateralPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateralValue",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateralizedRatio",
            type: "uint256",
          },
        ],
        internalType: "struct Liquidation.EvalUserPositionResult",
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
        name: "user",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_currency",
        type: "bytes32",
      },
    ],
    name: "evalUserPositionAll",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "debtBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakedCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateralPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateralValue",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateralizedRatio",
            type: "uint256",
          },
        ],
        internalType: "struct Liquidation.EvalUserPositionResult",
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
        name: "user",
        type: "address",
      },
    ],
    name: "getMarkTimestamp",
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
        name: "user",
        type: "address",
      },
    ],
    name: "getMarker",
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
        internalType: "contract IBuildBurnSystem",
        name: "_BuildBurnSystem",
        type: "address",
      },
      {
        internalType: "contract ICollateralSystem",
        name: "_CollateralSystem",
        type: "address",
      },
      {
        internalType: "contract IConfig",
        name: "_Config",
        type: "address",
      },
      {
        internalType: "contract IDebtSystem",
        name: "_DebtSystem",
        type: "address",
      },
      {
        internalType: "contract IPrices",
        name: "_Prices",
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
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "isPositionMarked",
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
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "fusdToBurn",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "currency",
        type: "bytes32",
      },
    ],
    name: "liquidatePosition",
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
        internalType: "bytes32",
        name: "currency",
        type: "bytes32",
      },
    ],
    name: "liquidatePositionMax",
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
        internalType: "bytes32",
        name: "_currency",
        type: "bytes32",
      },
    ],
    name: "markPosition",
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
        internalType: "bytes32",
        name: "_currency",
        type: "bytes32",
      },
    ],
    name: "removeMark",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "contract IPrices",
        name: "newPrices",
        type: "address",
      },
    ],
    name: "setPrices",
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
    name: "underCollateralizedMarks",
    outputs: [
      {
        internalType: "address",
        name: "marker",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "timestamp",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506124fc806100206000396000f3fe608060405234801561001057600080fd5b506004361061013e5760003560e01c8063075a78401461014357806307880b7f146101585780630c701d311461016b5780630f73eaaf146101895780631a192978146101a95780631c8e664e146101be57806325971dff146101df5780632d0ca322146101e757806337347d57146101ef578063418fe7b91461020257806343861c5a146102155780636c8381f8146102285780638b3892531461023057806396e73bc7146102505780639ef140b414610263578063a68813aa1461026b578063a8c5ee8014610273578063c141ce461461027b578063cc2a9a5b1461028e578063dbd8542e146102a1578063df5272e3146102b4578063e873b32c146102c7578063ec3e78b6146102cf578063ec75fca0146102d7578063f851a440146102ea578063fedfd535146102f2575b600080fd5b610156610151366004611c67565b6102fa565b005b610156610166366004611c67565b6103f5565b610173610486565b6040516101809190611de9565b60405180910390f35b61019c610197366004611c83565b610495565b6040516101809190612402565b6101b16105f3565b6040516101809190611eee565b6101d16101cc366004611c67565b610615565b604051610180929190611ec1565b610156610642565b6101b16106ce565b6101b16101fd366004611c67565b6106e5565b610173610210366004611c67565b610714565b610156610223366004611c67565b610732565b6101736107aa565b61024361023e366004611c67565b6107b9565b6040516101809190611ee3565b61015661025e366004611cae565b6107e6565b610173610846565b610173610855565b6101b1610864565b610156610289366004611c83565b61087b565b61015661029c366004611ce2565b6108b7565b6101566102af366004611c83565b610a5d565b61019c6102c2366004611c83565b610b92565b6101b1610d83565b610173610da1565b6101566102e5366004611c83565b610db0565b610173610f7e565b610173610f93565b600054610100900460ff16806103135750610313610fa2565b80610321575060005460ff16155b6103465760405162461bcd60e51b815260040161033d906122b5565b60405180910390fd5b600054610100900460ff16158015610371576000805460ff1961ff0019909116610100171660011790555b6001600160a01b0382166103975760405162461bcd60e51b815260040161033d9061213c565b6000805462010000600160b01b031916620100006001600160a01b03851602178155604051600080516020612487833981519152916103d7918590611dfd565b60405180910390a180156103f1576000805461ff00191690555b5050565b6000546201000090046001600160a01b031633146104255760405162461bcd60e51b815260040161033d90611fc0565b600180546001600160a01b038381166001600160a01b031983161792839055604051918116927f7f730391c4f0fa1bea34bcb9bff8c30a079b21a0359759160cb990648ab84c729261047a9285921690611dfd565b60405180910390a15050565b6032546001600160a01b031681565b61049d611bd8565b603554604051634e21d6c560e01b81526000916001600160a01b031690634e21d6c5906104d09087908790600401611e87565b604080518083038186803b1580156104e757600080fd5b505afa1580156104fb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061051f9190611d7b565b5060335460405163153b4f3360e11b81529192506000916001600160a01b0390911690632a769e6690610556908890600401611de9565b60206040518083038186803b15801561056e57600080fd5b505afa158015610582573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105a69190611d63565b9050600081156105bf576105ba8383610fb3565b6105c2565b60005b6040805160a08101825294855260006020860181905290850152606084019290925250608082015290505b92915050565b7a131a5c5d5a59185d1a5bdb931a5c5d5a59185d1bdc94995dd85c99602a1b81565b6037602052600090815260409020546001600160a01b03811690600160a01b90046001600160401b031682565b6001546001600160a01b0316331461066c5760405162461bcd60e51b815260040161033d90612173565b600080546001546001600160a01b039081166201000090810262010000600160b01b03198416179384905560405192819004821693600080516020612487833981519152936106c393869390920490911690611dfd565b60405180910390a150565b6f4c69717569646174696f6e526174696f60801b81565b6001600160a01b038116600090815260376020526040902054600160a01b90046001600160401b03165b919050565b6001600160a01b039081166000908152603760205260409020541690565b6000546201000090046001600160a01b031633146107625760405162461bcd60e51b815260040161033d90611fc0565b6001600160a01b0381166107885760405162461bcd60e51b815260040161033d90612059565b603680546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b031681565b6001600160a01b0316600090815260376020526040902054600160a01b90046001600160401b0316151590565b600082116108065760405162461bcd60e51b815260040161033d90612027565b6108416040518060800160405280856001600160a01b03168152602001336001600160a01b0316815260200184815260200183815250610fd8565b505050565b6035546001600160a01b031681565b6036546001600160a01b031681565b6f4c69717569646174696f6e44656c617960801b81565b6103f16040518060800160405280846001600160a01b03168152602001336001600160a01b031681526020016000815260200183815250610fd8565b600054610100900460ff16806108d057506108d0610fa2565b806108de575060005460ff16155b6108fa5760405162461bcd60e51b815260040161033d906122b5565b600054610100900460ff16158015610925576000805460ff1961ff0019909116610100171660011790555b61092e826102fa565b6001600160a01b0387166109545760405162461bcd60e51b815260040161033d90612059565b6001600160a01b03861661097a5760405162461bcd60e51b815260040161033d90612059565b6001600160a01b0385166109a05760405162461bcd60e51b815260040161033d90612059565b6001600160a01b0384166109c65760405162461bcd60e51b815260040161033d90612059565b6001600160a01b0383166109ec5760405162461bcd60e51b815260040161033d90612059565b603280546001600160a01b03199081166001600160a01b038a811691909117909255603380548216898416179055603480548216888416179055603580548216878416179055603680549091169185169190911790558015610a54576000805461ff00191690555b50505050505050565b610a66826107b9565b610a825760405162461bcd60e51b815260040161033d90612344565b610a8a611bd8565b610a948383610b92565b603454604051638b0da2a760e01b81529192506000916001600160a01b0390911690638b0da2a790610aca908690600401611eee565b60206040518083038186803b158015610ae257600080fd5b505afa158015610af6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b1a9190611d63565b90508082608001511115610b405760405162461bcd60e51b815260040161033d9061208c565b6001600160a01b0384166000908152603760205260409081902080546001600160e01b0319169055516000805160206124a783398151915290610b84908690611de9565b60405180910390a150505050565b610b9a611bd8565b603554604051634e21d6c560e01b81526000916001600160a01b031690634e21d6c590610bcd9087908790600401611e87565b604080518083038186803b158015610be457600080fd5b505afa158015610bf8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c1c9190611d7b565b5060335460405163c124302f60e01b81529192506000916001600160a01b039091169063c124302f90610c559088908890600401611e87565b60206040518083038186803b158015610c6d57600080fd5b505afa158015610c81573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca59190611d63565b6036546040516331d98b3f60e01b81529192506000916001600160a01b03909116906331d98b3f90610cdb908890600401611eee565b60206040518083038186803b158015610cf357600080fd5b505afa158015610d07573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d2b9190611d63565b90506000610d3983836115ee565b905060008115610d5257610d4d8583610fb3565b610d55565b60005b6040805160a08101825296875260208701959095529385019290925260608401525060808201529392505050565b76131a5c5d5a59185d1a5bdb93585c9ad95c94995dd85c99604a1b81565b6033546001600160a01b031681565b610dee6040518060400160405280601f81526020017f4c69717569646174696f6e3a3a6d61726b506f736974696f6e20737461727400815250611612565b610df7826107b9565b15610e145760405162461bcd60e51b815260040161033d90612107565b610e1c611bd8565b610e268383610b92565b60345460405163bd02d0f560e01b81529192506000916001600160a01b039091169063bd02d0f590610e6f906f4c69717569646174696f6e526174696f60801b90600401611eee565b60206040518083038186803b158015610e8757600080fd5b505afa158015610e9b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ebf9190611d63565b905080826080015111610ee45760405162461bcd60e51b815260040161033d906121c4565b60408051808201825233808252426001600160401b0390811660208085019182526001600160a01b038a811660009081526037909252908690209451855492516001600160a01b0319909316911617600160a01b600160e01b031916600160a01b91909216021790915590517f118402bf56ac6135e032e66d70ef7b6d722ffbe3f438445ed132a3df6072a9e691610b8491879190611dfd565b6000546201000090046001600160a01b031681565b6034546001600160a01b031681565b6000610fad30611658565b15905090565b6000610fd182610fcb85670de0b6b3a764000061165e565b90611698565b9392505050565b6110166040518060400160405280601f81526020017f4c69717569646174696f6e3a3a5f6c6971756964617465506f736974696f6e00815250611612565b61101e611c07565b5080516001600160a01b0390811660009081526037602090815260408083208151808301835290548086168252600160a01b90046001600160401b031692810192909252603454905163bd02d0f560e01b81529193169063bd02d0f59061109c906f4c69717569646174696f6e44656c617960801b90600401611eee565b60206040518083038186803b1580156110b457600080fd5b505afa1580156110c8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110ec9190611d63565b9050600082602001516001600160401b03161161111b5760405162461bcd60e51b815260040161033d90611f2c565b8082602001516001600160401b03160142116111495760405162461bcd60e51b815260040161033d906123b9565b50611152611c1e565b61115f83606001516116c2565b9050611169611bd8565b61117b84600001518560600151610b92565b905081600001518160800151116111a45760405162461bcd60e51b815260040161033d906121c4565b60006112ff6112dc61125a85600001516112546111d2886040015189602001516118b290919063ffffffff16565b73__$1cc4d8ad35c4e5444e1120de58c2894ed7$__63907af6c06040518163ffffffff1660e01b815260040160206040518083038186803b15801561121657600080fd5b505af415801561122a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061124e9190611d63565b906118b2565b906115ee565b73__$1cc4d8ad35c4e5444e1120de58c2894ed7$__63907af6c06040518163ffffffff1660e01b815260040160206040518083038186803b15801561129e57600080fd5b505af41580156112b2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112d69190611d63565b906118d7565b845160608501516112f9916112f191906115ee565b8551906118d7565b90610fb3565b905084604001516000141561131a5760408501819052611364565b6113406040518060600160405280603581526020016124526035913986604001516118ff565b80856040015111156113645760405162461bcd60e51b815260040161033d90612208565b60325485516040808801516060890151915163bb86bd6960e01b81526001600160a01b039094169363bb86bd69936113a193909291600401611ea0565b600060405180830381600087803b1580156113bb57600080fd5b505af11580156113cf573d6000803e3d6000fd5b505050506113db611c3f565b6113f78660400151846040015186602001518760400151611944565b6060810151815191925060009161140d916118b2565b6020850151909150816114325760405162461bcd60e51b815260040161033d90611f7b565b808211156114525760405162461bcd60e51b815260040161033d90612375565b505060006114ab6040518060a0016040528089600001516001600160a01b0316815260200189602001516001600160a01b03168152602001846000015181526020018660200151815260200189606001518152506119ad565b60208501519091506114bd90826118d7565b60208086019182526040805160e0810182528a516001600160a01b0390811682528a518116828501528b840151168183015291850151606080840191909152908501516080830152915160a08201529088015160c082015260009061152190611a40565b905061152d82826118b2565b885188516020808c01516040808e015160608f0151938a01518a83015192519799507fbd25d27c9ceffe9941848c9076729031f4ace7f07ad3faf14d0e5f8618aed76b9850611583979394919391928a92611e17565b60405180910390a18287604001511415610a545786516001600160a01b03166000908152603760205260409081902080546001600160e01b0319169055875190516000805160206124a7833981519152916115dd91611de9565b60405180910390a150505050505050565b6000670de0b6b3a7640000611603848461165e565b8161160a57fe5b049392505050565b611655816040516024016116269190611ef7565b60408051601f198184030181529190526020810180516001600160e01b031663104c13eb60e21b179052611ba1565b50565b3b151590565b60008261166d575060006105ed565b8282028284828161167a57fe5b0414610fd15760405162461bcd60e51b815260040161033d90612303565b60008082116116b95760405162461bcd60e51b815260040161033d90612281565b81838161160a57fe5b6116ca611c1e565b603454604051638b0da2a760e01b81526000916001600160a01b031690638b0da2a7906116fb908690600401611eee565b60206040518083038186803b15801561171357600080fd5b505afa158015611727573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061174b9190611d63565b60345460405163bd02d0f560e01b81529192506000916001600160a01b039091169063bd02d0f59061179b9076131a5c5d5a59185d1a5bdb93585c9ad95c94995dd85c99604a1b90600401611eee565b60206040518083038186803b1580156117b357600080fd5b505afa1580156117c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117eb9190611d63565b60345460405163bd02d0f560e01b81529192506000916001600160a01b039091169063bd02d0f59061183f907a131a5c5d5a59185d1a5bdb931a5c5d5a59185d1bdc94995dd85c99602a1b90600401611eee565b60206040518083038186803b15801561185757600080fd5b505afa15801561186b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061188f9190611d63565b604080516060810182529485526020850193909352918301919091525092915050565b600082820183811015610fd15760405162461bcd60e51b815260040161033d906120d2565b6000828211156118f95760405162461bcd60e51b815260040161033d9061224a565b50900390565b6103f18282604051602401611915929190611f0a565b60408051601f198184030181529190526020810180516001600160e01b03166309710a9d60e41b179052611ba1565b61194c611c3f565b60006119588686610fb3565b9050600061196682866115ee565b9050600061197483866115ee565b9050600061198283836118b2565b6040805160808101825295865260208601949094529284019190915250606082015295945050505050565b60006119c182604001518360600151611bc2565b9050801561070f57603354825160208401516080850151604051637c55441760e11b81526001600160a01b039094169363f8aa882e93611a0993909290918790600401611e5e565b600060405180830381600087803b158015611a2357600080fd5b505af1158015611a37573d6000803e3d6000fd5b50505050919050565b600080611a5e836080015184606001516118b290919063ffffffff16565b9050611a6e818460a00151611bc2565b60808401519092508215611b9a576000611a9983610fcb87606001518761165e90919063ffffffff16565b90506000611aa785836118d7565b9050611ab383826118d7565b6033548751602089015160c08a0151604051637c55441760e11b81529497506001600160a01b039093169363f8aa882e93611af49392918890600401611e5e565b600060405180830381600087803b158015611b0e57600080fd5b505af1158015611b22573d6000803e3d6000fd5b505060335488516040808b015160c08c01519151637c55441760e11b81526001600160a01b03909416955063f8aa882e9450611b65939091908790600401611e5e565b600060405180830381600087803b158015611b7f57600080fd5b505af1158015611b93573d6000803e3d6000fd5b5050505050505b5050919050565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b6000818310611bd15781610fd1565b5090919050565b6040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b604080518082019091526000808252602082015290565b60405180606001604052806000815260200160008152602001600081525090565b6040518060800160405280600081526020016000815260200160008152602001600081525090565b600060208284031215611c78578081fd5b8135610fd18161243c565b60008060408385031215611c95578081fd5b8235611ca08161243c565b946020939093013593505050565b600080600060608486031215611cc2578081fd5b8335611ccd8161243c565b95602085013595506040909401359392505050565b60008060008060008060c08789031215611cfa578182fd5b8635611d058161243c565b95506020870135611d158161243c565b94506040870135611d258161243c565b93506060870135611d358161243c565b92506080870135611d458161243c565b915060a0870135611d558161243c565b809150509295509295509295565b600060208284031215611d74578081fd5b5051919050565b60008060408385031215611d8d578182fd5b505080516020909101519092909150565b60008151808452815b81811015611dc357602081850181015186830182015201611da7565b81811115611dd45782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0391909116815260200190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b03988916815296881660208801529490961660408601526060850192909252608084015260a083015260c082019290925260e08101919091526101000190565b6001600160a01b0394851681529290931660208301526040820152606081019190915260800190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b039390931683526020830191909152604082015260600190565b6001600160a01b039290921682526001600160401b0316602082015260400190565b901515815260200190565b90815260200190565b600060208252610fd16020830184611d9e565b600060408252611f1d6040830185611d9e565b90508260208301529392505050565b6020808252602f908201527f4c69717569646174696f6e3a206e6f74206d61726b656420666f7220756e646560408201526e1c90dbdb1b185d195c985b1a5e9959608a1b606082015260800190565b60208082526025908201527f4c69717569646174696f6e3a206e6f20636f6c6c61746572616c2077697468646040820152641c985dd85b60da1b606082015260800190565b60208082526041908201527f41646d696e5570677261646561626c653a206f6e6c792074686520636f6e747260408201527f6163742061646d696e2063616e20706572666f726d207468697320616374696f6060820152603760f91b608082015260a00190565b602080825260189082015277131a5c5d5a59185d1a5bdb8e881e995c9bc8185b5bdd5b9d60421b604082015260600190565b6020808252601990820152784c69717569646174696f6e3a207a65726f206164647265737360381b604082015260600190565b60208082526026908201527f4c69717569646174696f6e3a207374696c6c20756e646572436f6c6c61746572604082015265185b1a5e995960d21b606082015260800190565b6020808252601b908201527a536166654d6174683a206164646974696f6e206f766572666c6f7760281b604082015260600190565b6020808252601b908201527a131a5c5d5a59185d1a5bdb8e88185b1c9958591e481b585c9ad959602a1b604082015260600190565b6020808252601e908201527f41646d696e5570677261646561626c653a207a65726f20616464726573730000604082015260600190565b60208082526031908201527f41646d696e5570677261646561626c653a206f6e6c792063616e6469646174656040820152701031b0b7103132b1b7b6b29030b236b4b760791b606082015260800190565b60208082526024908201527f4c69717569646174696f6e3a206e6f7420756e646572436f6c6c61746572616c6040820152631a5e995960e21b606082015260800190565b60208082526022908201527f4c69717569646174696f6e3a206275726e20616d6f756e7420746f6f206c6172604082015261676560f01b606082015260800190565b6020808252601e908201527f536166654d6174683a207375627472616374696f6e206f766572666c6f770000604082015260600190565b6020808252601a9082015279536166654d6174683a206469766973696f6e206279207a65726f60301b604082015260600190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526021908201527f536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f6040820152607760f81b606082015260800190565b602080825260179082015276131a5c5d5a59185d1a5bdb8e881b9bdd081b585c9ad959604a1b604082015260600190565b60208082526024908201527f4c69717569646174696f6e3a20696e73756666696369656e7420636f6c6c6174604082015263195c985b60e21b606082015260800190565b60208082526029908201527f4c69717569646174696f6e3a206c69717569646174696f6e2064656c6179206e6040820152681bdd081c185cdcd95960ba1b606082015260800190565b600060a082019050825182526020830151602083015260408301516040830152606083015160608301526080830151608083015292915050565b6001600160a01b038116811461165557600080fdfe4c69717569646174696f6e3a3a5f6c6971756964617465506f736974696f6e20706172616d732e66757364546f4275726e3a2025737e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f2f8cd325cb485626bd1f4b258153ea2c5da433cfee4505572b6abd139a3291bfa2646970667358221220bc8eca89888e7885d35ece04b71e0a3c6fcbe7d83fd62e76685f32eb3c4d828e64736f6c634300060c0033";

export interface LiquidationLibraryAddresses {
  ["__$1cc4d8ad35c4e5444e1120de58c2894ed7$__"]: string;
}