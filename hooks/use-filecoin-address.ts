import { QueryKey } from "@/lib/constants";
import { FilecoinAddress } from "@/types/common";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { type Address } from "viem";
import { useChainId } from "wagmi";
import { useFilecoinPublicClient } from "./use-filecoin-public-client";

type UseFilecoinAddressQueryKey = [
  QueryKey.FILECOIN_ADDRESS,
  number,
  Address,
  boolean,
];

export interface UseFilecoinAddressParameters {
  ethAddress: Address;
  robust?: boolean;
}

const f0AddressRegex = /^[f|t]{1}0[A-Za-z0-9]+$/;

export function useFilecoinAddress({
  ethAddress,
  robust = false,
}: UseFilecoinAddressParameters) {
  const chainId = useChainId();
  const filecoinClient = useFilecoinPublicClient();

  const queryFn = useCallback<
    QueryFunction<FilecoinAddress, UseFilecoinAddressQueryKey>
  >(
    async ({ queryKey }) => {
      if (!filecoinClient) {
        throw new Error("Filecoin client not available");
      }

      const [, , ethAddress, robust] = queryKey;
      const maybeFilecoinAddress = await filecoinClient.request({
        method: "Filecoin.EthAddressToFilecoinAddress",
        params: [ethAddress],
      });

      if (maybeFilecoinAddress === null) {
        throw new Error(
          `Could not convert ETH address "${ethAddress} to Filecoin address."`
        );
      }

      if (!robust || !f0AddressRegex.test(maybeFilecoinAddress)) {
        return maybeFilecoinAddress;
      }

      const maybeFilecoinRobustAddress = await filecoinClient.request({
        method: "Filecoin.StateLookupRobustAddress",
        params: [maybeFilecoinAddress, null],
      });

      if (maybeFilecoinRobustAddress === null) {
        throw new Error(
          `Could not convert ETH address "${ethAddress} to Filecoin address."`
        );
      }

      return maybeFilecoinRobustAddress;
    },
    [filecoinClient]
  );

  return useQuery({
    queryFn,
    queryKey: [QueryKey.FILECOIN_ADDRESS, chainId, ethAddress, robust],
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    retryDelay(failureCount) {
      return 1000 * 2 ** (failureCount - 1);
    },
  });
}
