import clientABI from "@/abi/Client";
import { type Address } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";

export type UseClientAllowanceParameters = {
  clientContractAddress: Address | undefined;
  clientAddress: Address;
  refetchOnEvents?: boolean;
};

export function useClientAllowance({
  clientContractAddress,
  clientAddress,
  refetchOnEvents = false,
}: UseClientAllowanceParameters) {
  const { refetch, ...restOfReadContract } = useReadContract({
    abi: clientABI,
    address: clientContractAddress,
    functionName: "allowances",
    args: [clientAddress],
    query: {
      enabled: !!clientContractAddress,
    },
  });

  useWatchContractEvent({
    abi: clientABI,
    address: clientContractAddress,
    eventName: "AllowanceChanged",
    onLogs() {
      refetch();
    },
    enabled: !!clientContractAddress && refetchOnEvents,
  });

  return {
    ...restOfReadContract,
    refetch,
  };
}
