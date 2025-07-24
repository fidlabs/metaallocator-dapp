import { type Hex, type Address } from "viem";

interface WaitableTransaction {
  wait(): Promise<unknown>;
}

export type FilecoinAddress =
  `${"f" | "t"}${"0" | "1" | "2" | "3" | "4"}${string}`;

export type FilecoinRPCSchema = [
  {
    Method: "Filecoin.EthAddressToFilecoinAddress";
    Parameters: [ethAddress: Address];
    ReturnType: FilecoinAddress | null;
  },
  {
    Method: "Filecoin.FilecoinAddressToEthAddress";
    Parmeters: [
      filecoinAddress: FilecoinAddress,
      blkNum: "pending" | "latest" | "finalized" | "safe" | Hex,
    ];
    ReturnType: Address;
  },
  {
    Method: "Filecoin.StateVerifierStatus";
    Parameters: [filecoinAddress: FilecoinAddress, null];
    ReturnType: string | null;
  },
  {
    Method: "Filecoin.StateLookupRobustAddress";
    Parameters: [filecoinAddress: FilecoinAddress, null];
    ReturnType: FilecoinAddress | null;
  },
];

const filecoinAddresRegex = /^[f|t]{1}[0-4]{1}[A-Za-z0-9]+$/;

export function isFilecoinAddress(input: unknown): input is FilecoinAddress {
  return typeof input === "string" && filecoinAddresRegex.test(input);
}

export function isPlainObject(
  input: unknown
): input is Record<string, unknown> {
  return !!input && typeof input === "object" && !Array.isArray(input);
}

export function isWaitableTransaction(
  input: unknown
): input is WaitableTransaction {
  return isPlainObject(input) && typeof input.wait === "function";
}
