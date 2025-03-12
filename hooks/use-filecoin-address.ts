import { QueryKey } from "@/lib/constants";
import { FilecoinAddress } from "@/types/common";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { type Address } from "viem";
import { useFilecoinPublicClient } from "./use-filecoin-public-client";
import { useChainId } from "wagmi";

type UseFilecoinAddressQueryKey = [QueryKey.FILECOIN_ADDRESS, number, Address];

export function useFilecoinAddress(ethAddress: Address) {
  const chainId = useChainId();
  const filecoinClient = useFilecoinPublicClient();

  const queryFn = useCallback<
    QueryFunction<FilecoinAddress, UseFilecoinAddressQueryKey>
  >(
    async ({ queryKey }) => {
      if (!filecoinClient) {
        throw new Error("Filecoin client not available");
      }

      const [, , ethAddress] = queryKey;
      const maybeFilecoinAddress = await filecoinClient.request({
        method: "Filecoin.EthAddressToFilecoinAddress",
        params: [ethAddress],
      });

      if (maybeFilecoinAddress === null) {
        throw new Error(
          `Could not convert ETH address "${ethAddress} to Filecoin address."`
        );
      }

      return maybeFilecoinAddress;
    },
    [filecoinClient]
  );

  return useQuery({
    queryFn,
    queryKey: [QueryKey.FILECOIN_ADDRESS, chainId, ethAddress],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
