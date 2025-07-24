import pauseableABI from "@/abi/Pausable";
import { type Address } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";

export interface UseOwnableOwnerParameters {
  contractAddress: Address | undefined;
  refetchOnEvents?: boolean;
}

export function usePausablePaused({
  contractAddress,
  refetchOnEvents = false,
}: UseOwnableOwnerParameters) {
  const { refetch, ...restOfQuery } = useReadContract({
    address: contractAddress,
    abi: pauseableABI,
    functionName: "paused",
    query: {
      enabled: !!contractAddress,
    },
  });

  useWatchContractEvent({
    enabled: !!contractAddress && refetchOnEvents,
    address: contractAddress,
    abi: pauseableABI,
    eventName: "Paused",
    onLogs: () => {
      refetch();
    },
  });

  useWatchContractEvent({
    enabled: !!contractAddress && refetchOnEvents,
    address: contractAddress,
    abi: pauseableABI,
    eventName: "Unpaused",
    onLogs: () => {
      refetch();
    },
  });

  return {
    ...restOfQuery,
    refetch,
  };
}
