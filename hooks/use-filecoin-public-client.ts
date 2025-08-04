import type { FilecoinRPCSchema } from "@/types/common";
import type { Client, EIP1193RequestFn } from "viem";
import { filecoin, filecoinCalibration } from "viem/chains";
import { useChainId, useClient } from "wagmi";

const filecoinChainsIds = [filecoin.id, filecoinCalibration.id] as const;
type FilecoinChainId = (typeof filecoinChainsIds)[number];

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
