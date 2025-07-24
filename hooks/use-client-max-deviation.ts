import clientABI from "@/abi/Client";
import { useCallback } from "react";
import { type Address } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";

export interface UseClientMaxDeviationParameters {
  clientContractAddress: Address | undefined;
  clientAddress: Address;
  refetchOnEvents?: boolean;
}

export function useClientMaxDeviation({
  clientContractAddress,
  clientAddress,
  refetchOnEvents = false,
}: UseClientMaxDeviationParameters) {
  const { refetch, ...restOfReadContract } = useReadContract({
    address: clientContractAddress,
    abi: clientABI,
    functionName: "clientConfigs",
    args: [clientAddress],
    query: {
      enabled: !!clientContractAddress,
    },
  });

  const handleEventLogs = useCallback(() => {
    refetch();
  }, [refetch]);

  useWatchContractEvent({
    address: clientContractAddress,
    abi: clientABI,
    eventName: "ClientConfigChanged",
    onLogs: handleEventLogs,
    enabled: !!clientContractAddress && refetchOnEvents,
  });

  return {
    refetch,
    ...restOfReadContract,
  };
}
