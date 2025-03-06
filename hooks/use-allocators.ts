import allocatorABI from "@/abi/Allocator";
import type { Address } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";

export function useAllocators(allocatorContractAddress: Address) {
  const { refetch, ...restOfQuery } = useReadContract({
    abi: allocatorABI,
    address: allocatorContractAddress,
    functionName: "getAllocators",
  });

  useWatchContractEvent({
    address: allocatorContractAddress,
    abi: allocatorABI,
    eventName: "AllowanceChanged",
    onLogs: () => refetch(),
  });

  return {
    ...restOfQuery,
    refetch,
  };
}
