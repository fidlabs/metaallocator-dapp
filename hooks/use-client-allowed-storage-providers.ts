import clientABI from "@/abi/Client";
import { useCallback } from "react";
import { type Address } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";

export type UseClientAllowedStorageProvidersParameters = {
  clientContractAddress: Address | undefined;
  clientAddress: Address;
  refetchOnEvents?: boolean;
};

export function useClientAllowedStorageProviders({
  clientContractAddress,
  clientAddress,
  refetchOnEvents = false,
}: UseClientAllowedStorageProvidersParameters) {
  const { refetch, ...restOfReadContract } = useReadContract({
    abi: clientABI,
    address: clientContractAddress,
    functionName: "clientSPs",
    args: [clientAddress],
    query: {
      enabled: !!clientContractAddress,
    },
  });

  const handleLogs = useCallback(() => {
    refetch();
  }, [refetch]);

  useWatchContractEvent({
    abi: clientABI,
    address: clientContractAddress,
    eventName: "SPsAddedForClient",
    onLogs: handleLogs,
    enabled: !!clientContractAddress && refetchOnEvents,
  });

  useWatchContractEvent({
    abi: clientABI,
    address: clientContractAddress,
    eventName: "SPsRemovedForClient",
    onLogs: handleLogs,
    enabled: !!clientContractAddress && refetchOnEvents,
  });

  return {
    ...restOfReadContract,
    refetch,
  };
}
