import { QueryKey } from "@/lib/constants";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Address } from "viem";
import { useFilecoinPublicClient } from "./use-filecoin-public-client";

type UseAddressDatacapQueryKey = [QueryKey.ADDRESS_DATACAP, Address];
type UseAddressDatacapReturnType = bigint;

export function useAddressDatacap(address: Address) {
  const client = useFilecoinPublicClient();

  const queryFn = useCallback<
    QueryFunction<UseAddressDatacapReturnType, UseAddressDatacapQueryKey>
  >(
    async ({ queryKey }) => {
      const [, address] = queryKey;

      if (!client) {
        throw new Error("Wagmi client not initialized");
      }

      const filecoinAddress = await client.request({
        method: "Filecoin.EthAddressToFilecoinAddress",
        params: [address],
      });

      if (typeof filecoinAddress !== "string") {
        throw new Error(
          "Invalid response when converting ETH address to Filecoin address"
        );
      }

      const datacap = await client.request({
        method: "Filecoin.StateVerifierStatus",
        params: [filecoinAddress, null],
      });

      if (datacap === null) {
        return 0n;
      }

      if (typeof datacap !== "string") {
        throw new Error(
          `Invalid response when getting datacap of address ${filecoinAddress}. Type ${typeof datacap} is not string.`
        );
      }

      return BigInt(datacap);
    },
    [client]
  );

  return useQuery({
    queryFn,
    queryKey: [QueryKey.ADDRESS_DATACAP, address],
  });
}
