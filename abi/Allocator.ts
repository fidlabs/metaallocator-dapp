import { type Abi } from "viem";
import ownable2StepABI from "./Ownable2Step";
import UUPSUpgradeableABI from "./UUPSUpgradeable";

export const allocatorABI = [
  ...ownable2StepABI,
  ...UUPSUpgradeableABI,
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "addAllowance",
    inputs: [
      {
        name: "allocator",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addVerifiedClient",
    inputs: [
      {
        name: "clientAddress",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      {
        name: "allocator",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "allowance_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllocators",
    inputs: [],
    outputs: [
      {
        name: "allocators",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "initialOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "setAllowance",
    inputs: [
      {
        name: "allocator",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "event",
    name: "AllowanceChanged",
    inputs: [
      {
        name: "allocator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "allowanceBefore",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "allowanceAfter",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DatacapAllocated",
    inputs: [
      {
        name: "allocator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "client",
        type: "bytes",
        indexed: true,
        internalType: "bytes",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ActorError",
    inputs: [
      {
        name: "errorCode",
        type: "int256",
        internalType: "int256",
      },
    ],
  },
  {
    type: "error",
    name: "ActorNotFound",
    inputs: [],
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AlreadyHasAllowance",
    inputs: [],
  },
  {
    type: "error",
    name: "AlreadyZero",
    inputs: [],
  },
  {
    type: "error",
    name: "AmountEqualZero",
    inputs: [],
  },

  {
    type: "error",
    name: "FailToCallActor",
    inputs: [],
  },
  {
    type: "error",
    name: "FailedInnerCall",
    inputs: [],
  },
  {
    type: "error",
    name: "FunctionDisabled",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientAllowance",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidCodec",
    inputs: [
      {
        name: "",
        type: "uint64",
        internalType: "uint64",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidInitialization",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidResponseLength",
    inputs: [],
  },
  {
    type: "error",
    name: "NotEnoughBalance",
    inputs: [
      {
        name: "balance",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "NotInitializing",
    inputs: [],
  },
] as const satisfies Abi;

export default allocatorABI;
