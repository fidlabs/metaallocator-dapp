import ownableABI from "@/abi/Ownable";
import type { Address } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";

export interface UseOwnableOwnerParameters {
  contractAddress: Address | undefined;
  refetchOnEvents?: boolean;
}

export function useOwnableOwner({
  contractAddress,
  refetchOnEvents = false,
}: UseOwnableOwnerParameters) {
  const { refetch, ...restOfQuery } = useReadContract({
    address: contractAddress,
    abi: ownableABI,
    functionName: "owner",
    query: {
      enabled: !!contractAddress,
    },
  });

  useWatchContractEvent({
    enabled: !!contractAddress && refetchOnEvents,
    address: contractAddress,
    abi: ownableABI,
    eventName: "OwnershipTransferred",
    onLogs: () => refetch,
  });

  return {
    ...restOfQuery,
    refetch,
  };
}
