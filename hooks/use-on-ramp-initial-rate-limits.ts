import onRampABI from "@/abi/OnRamp";
import { useCallback } from "react";
import { type Address } from "viem";
import { useReadContracts, useWatchContractEvent } from "wagmi";

type UseOnRampInitialRateLimitParamaters = {
  onRampContractAddress: Address;
  refetchOnEvents?: boolean;
};

export function useOnRampInitialRateLimits({
  onRampContractAddress,
  refetchOnEvents = false,
}: UseOnRampInitialRateLimitParamaters) {
  const onRampContract = {
    address: onRampContractAddress,
    abi: onRampABI,
  } as const;

  const { refetch, ...restOfReadContracts } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        ...onRampContract,
        functionName: "initialWindowSizeInBlocks",
      },
      {
        ...onRampContract,
        functionName: "initialLimitPerWindow",
      },
    ],
  });

  const handleEventLogs = useCallback(() => {
    refetch();
  }, [refetch]);

  useWatchContractEvent({
    ...onRampContract,
    eventName: "InitialRateLimitParametersChanged",
    onLogs: handleEventLogs,
    enabled: refetchOnEvents,
  });

  return {
    refetch,
    ...restOfReadContracts,
  };
}
