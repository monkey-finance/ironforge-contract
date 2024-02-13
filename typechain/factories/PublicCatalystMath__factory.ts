/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { PublicCatalystMath } from "../PublicCatalystMath";

export class PublicCatalystMath__factory extends ContractFactory {
  constructor(
    linkLibraryAddresses: PublicCatalystMathLibraryAddresses,
    signer?: Signer
  ) {
    super(
      _abi,
      PublicCatalystMath__factory.linkBytecode(linkLibraryAddresses),
      signer
    );
  }

  static linkBytecode(
    linkLibraryAddresses: PublicCatalystMathLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$5681baf604afa18c34a8ae72d7ec4335c9\\$__", "g"),
      linkLibraryAddresses["__$5681baf604afa18c34a8ae72d7ec4335c9$__"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  deploy(overrides?: Overrides): Promise<PublicCatalystMath> {
    return super.deploy(overrides || {}) as Promise<PublicCatalystMath>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PublicCatalystMath {
    return super.attach(address) as PublicCatalystMath;
  }
  connect(signer: Signer): PublicCatalystMath__factory {
    return super.connect(signer) as PublicCatalystMath__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PublicCatalystMath {
    return new Contract(address, _abi, signerOrProvider) as PublicCatalystMath;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "calcCatalyst",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610147806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063d5ddf9d614610030575b600080fd5b61004361003e3660046100e1565b610055565b60405190815260200160405180910390f35b604051636aeefceb60e11b81526004810182905260009073__$5681baf604afa18c34a8ae72d7ec4335c9$__9063d5ddf9d69060240160206040518083038186803b1580156100a357600080fd5b505af41580156100b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100db91906100f9565b92915050565b6000602082840312156100f2578081fd5b5035919050565b60006020828403121561010a578081fd5b505191905056fea26469706673582212204af561c1e253b3d34eb969458c6ce311111921a5a9558aed3ad0c3e01690259364736f6c63430008040033";

export interface PublicCatalystMathLibraryAddresses {
  ["__$5681baf604afa18c34a8ae72d7ec4335c9$__"]: string;
}