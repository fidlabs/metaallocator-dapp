import ownable2StepABI from "@/abi/Ownable2Step";
import type { Address } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";

export interface UseOwnable2StepPendingOwnerParameters {
  contractAddress: Address | undefined;
  refetchOnEvents?: boolean;
}

export function useOwnable2StepPendingOwner({
  contractAddress,
  refetchOnEvents = false,
}: UseOwnable2StepPendingOwnerParameters) {
  const { refetch, ...restOfQuery } = useReadContract({
    address: contractAddress,
    abi: ownable2StepABI,
    functionName: "pendingOwner",
    query: {
      enabled: !!contractAddress,
    },
  });

  useWatchContractEvent({
    enabled: refetchOnEvents,
    address: contractAddress,
    abi: ownable2StepABI,
    eventName: "OwnershipTransferStarted",
    onLogs: () => refetch(),
  });

  return {
    ...restOfQuery,
    refetch,
  };
}
