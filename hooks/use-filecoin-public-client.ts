import type { FilecoinAddress } from "@/types/common";
import type { Address, Client, EIP1193RequestFn, Hex } from "viem";
import { filecoin, filecoinCalibration } from "viem/chains";
import { useChainId, useClient } from "wagmi";

const filecoinChainsIds = [filecoin.id, filecoinCalibration.id] as const;
type FilecoinChainId = (typeof filecoinChainsIds)[number];

type FilecoinRPCSchema = [
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

export type FilecoinClient = Omit<Client, "request"> & {
  request: EIP1193RequestFn<FilecoinRPCSchema>;
};

export function useFilecoinPublicClient() {
  const chainId = useChainId();
  const client = useClient();
  assertValidChain(chainId);

  return client ? (client as FilecoinClient) : undefined;
}

function assertValidChain(chainId: number): asserts chainId is FilecoinChainId {
  const valid = (filecoinChainsIds as unknown as number[]).includes(chainId);

  if (!valid) {
    throw new Error("Cannot use Filecoin client with non Filecoin chain.");
  }
}
