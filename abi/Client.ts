import ownable2StepABI from "./Ownable2Step";

export const clientABI = [
  ...ownable2StepABI,
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DENOMINATOR",
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
    name: "TOKEN_PRECISION",
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
    name: "allowances",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "allowance",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "clientAllocationsPerSP",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "providers",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "allocations",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "clientConfigs",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "maxDeviationFromFairDistribution",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "clientSPs",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "providers",
        type: "uint256[]",
        internalType: "uint256[]",
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
    name: "handle_filecoin_method",
    inputs: [
      {
        name: "method",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "inputCodec",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "params",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "exitCode",
        type: "uint32",
        internalType: "uint32",
      },
      {
        name: "codec",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    stateMutability: "view",
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
    name: "totalAllocations",
    inputs: [
      {
        name: "client",
        type: "address",
        internalType: "address",
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
    name: "transfer",
    inputs: [
      {
        name: "params",
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
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AllowanceChanged",
    inputs: [
      {
        name: "client",
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
    name: "ClientConfigChanged",
    inputs: [
      {
        name: "client",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "maxDeviation",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DatacapSpent",
    inputs: [
      {
        name: "client",
        type: "address",
        indexed: true,
        internalType: "address",
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
    type: "event",
    name: "SPsAddedForClient",
    inputs: [
      {
        name: "client",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "allowedSPs",
        type: "uint64[]",
        indexed: false,
        internalType: "uint64[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SPsRemovedForClient",
    inputs: [
      {
        name: "client",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "disallowedSPs",
        type: "uint64[]",
        indexed: false,
        internalType: "uint64[]",
      },
    ],
    anonymous: false,
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
    name: "EnumerableMapNonexistentKey",
    inputs: [
      {
        name: "key",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
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
    name: "GetClaimsCallFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientAllowance",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAllocationRequest",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidArgument",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidCaller",
    inputs: [
      {
        name: "caller",
        type: "address",
        internalType: "address",
      },
      {
        name: "expectedCaller",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidClaimExtensionRequest",
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
    name: "InvalidOperatorData",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidResponseLength",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidTokenReceived",
    inputs: [],
  },
  {
    type: "error",
    name: "MethodNotHandled",
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
    name: "NegativeValueNotAllowed",
    inputs: [],
  },
  {
    type: "error",
    name: "NotAllowedSP",
    inputs: [
      {
        name: "provider",
        type: "uint64",
        internalType: "CommonTypes.FilActorId",
      },
    ],
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
  {
    type: "error",
    name: "TransferFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "UnfairDistribution",
    inputs: [
      {
        name: "maxPerSp",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "providedToSingleSp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "UnsupportedToken",
    inputs: [],
  },
  {
    type: "error",
    name: "UnsupportedType",
    inputs: [],
  },
] as const;

export default clientABI;
