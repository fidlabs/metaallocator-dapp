export const beaconProxyFactoryABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "logic_",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "BEACON",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract UpgradeableBeacon",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "create",
    inputs: [
      {
        name: "manager_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "nonce",
    inputs: [
      {
        name: "manager",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "deployCounter",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ProxyCreated",
    inputs: [
      {
        name: "proxy",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "Create2EmptyBytecode",
    inputs: [],
  },
  {
    type: "error",
    name: "Create2FailedDeployment",
    inputs: [],
  },
  {
    type: "error",
    name: "Create2InsufficientBalance",
    inputs: [
      {
        name: "balance",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "needed",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
] as const;

export default beaconProxyFactoryABI;
