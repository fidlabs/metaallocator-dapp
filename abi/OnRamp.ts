import { type Abi } from "viem";
import pauseableABI from "./Pausable";
import accessControlEnumerableABI from "./AccessControlEnumberable";

export const onRampABI = [
  ...pauseableABI,
  ...accessControlEnumerableABI,
  {
    type: "constructor",
    inputs: [
      {
        name: "clientContract",
        type: "address",
        internalType: "contract IClient",
      },
      {
        name: "admin",
        type: "address",
        internalType: "address",
      },
      {
        name: "manager",
        type: "address",
        internalType: "address",
      },
      {
        name: "allocator",
        type: "address",
        internalType: "address",
      },
      {
        name: "initialWindowSizeInBlocks_",
        type: "uint128",
        internalType: "uint128",
      },
      {
        name: "initialLimitPerWindow_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "fallback",
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ALLOCATOR_ROLE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "CLIENT_CONTRACT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IClient",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MANAGER_ROLE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addAllowedSPsForClient",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
      {
        name: "allowedSPs_",
        type: "uint64[]",
        internalType: "uint64[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addAllowedSPsForClientPacked",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
      {
        name: "allowedSPs_",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "clientAllocations",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
      {
        name: "window",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "allocations",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "clientWindow",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "window",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "clients",
    inputs: [
      {
        name: "clientAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "windowOffset",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "limitPerWindow",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "windowSizeInBlocks",
        type: "uint128",
        internalType: "uint128",
      },
      {
        name: "locked",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decreaseAllowance",
    inputs: [
      {
        name: "client",
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
    name: "increaseAllowance",
    inputs: [
      {
        name: "client",
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
    name: "initialLimitPerWindow",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialWindowSizeInBlocks",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint128",
        internalType: "uint128",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lock",
    inputs: [
      {
        name: "client",
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
    name: "multicall",
    inputs: [
      {
        name: "data",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [
      {
        name: "results",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "removeAllowedSPsForClient",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
      {
        name: "disallowedSPs_",
        type: "uint64[]",
        internalType: "uint64[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeAllowedSPsForClientPacked",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
      {
        name: "disallowedSPs_",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "setClientMaxDeviationFromFairDistribution",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
      {
        name: "maxDeviation",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setClientRateLimitParameters",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
      {
        name: "windowSizeInBlocks",
        type: "uint128",
        internalType: "uint128",
      },
      {
        name: "limitPerWindow",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setInitialRateLimitParameters",
    inputs: [
      {
        name: "initialWindowSizeInBlocks_",
        type: "uint128",
        internalType: "uint128",
      },
      {
        name: "initialLimitPerWindow_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [
      {
        name: "interfaceId",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct DataCapTypes.TransferParams",
        components: [
          {
            name: "to",
            type: "tuple",
            internalType: "struct CommonTypes.FilAddress",
            components: [
              {
                name: "data",
                type: "bytes",
                internalType: "bytes",
              },
            ],
          },
          {
            name: "amount",
            type: "tuple",
            internalType: "struct CommonTypes.BigInt",
            components: [
              {
                name: "val",
                type: "bytes",
                internalType: "bytes",
              },
              {
                name: "neg",
                type: "bool",
                internalType: "bool",
              },
            ],
          },
          {
            name: "operator_data",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "unlock",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "event",
    name: "ClientRateLimitParametersChanged",
    inputs: [
      {
        name: "client",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "windowSizeInBlocks",
        type: "uint128",
        indexed: false,
        internalType: "uint128",
      },
      {
        name: "limitPerWindow",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "InitialRateLimitParametersChanged",
    inputs: [
      {
        name: "initialWindowSizeInBlocks",
        type: "uint128",
        indexed: false,
        internalType: "uint128",
      },
      {
        name: "initialLimitPerWindow",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Locked",
    inputs: [
      {
        name: "client",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Unlocked",
    inputs: [
      {
        name: "client",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
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
    name: "ClientLocked",
    inputs: [],
  },

  {
    type: "error",
    name: "FailedCall",
    inputs: [],
  },
  {
    type: "error",
    name: "Forbidden",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidArgument",
    inputs: [],
  },
  {
    type: "error",
    name: "RateLimited",
    inputs: [],
  },
  {
    type: "error",
    name: "Unauthorized",
    inputs: [],
  },
] as const satisfies Abi;

export default onRampABI;
