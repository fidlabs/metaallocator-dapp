import allocatorABI from "@/abi/Allocator";
import { useCallback } from "react";
import type { Address, WatchContractEventOnLogsFn } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";

type EventWatchFn = WatchContractEventOnLogsFn<
  typeof allocatorABI,
  "AllowanceChanged"
>;

export function useAllocatorAllowance(
  allocatorContractAddress: Address,
  allocatorAddress: Address
) {
  const { refetch, ...restOfQuery } = useReadContract({
    abi: allocatorABI,
    address: allocatorContractAddress,
    functionName: "allowance",
    args: [allocatorAddress],
  });

  const handleEvent = useCallback<EventWatchFn>(
    (logs) => {
      const allowanceChanged =
        logs.findIndex((log) => log.args.allocator === allocatorAddress) !== -1;

      if (allowanceChanged) {
        refetch();
      }
    },
    [allocatorAddress, refetch]
  );

  useWatchContractEvent({
    address: allocatorContractAddress,
    abi: allocatorABI,
    eventName: "AllowanceChanged",
    onLogs: handleEvent,
  });

  return {
    ...restOfQuery,
    refetch,
  };
}
