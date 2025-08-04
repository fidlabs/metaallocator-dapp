import onRampABI from "@/abi/OnRamp";
import { useCallback } from "react";
import { type Address } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { type ReadContractData } from "wagmi/query";

export type UseOnRampClientInfoParameters = {
  onRampContractAddress: Address;
  clientAddress: Address;
  refetchOnEvents?: boolean;
};

export interface ClientInfo {
  windowOffset: bigint;
  limitPerWindow: bigint;
  windowSizeInBlock: bigint;
  locked: boolean;
}

function tupleToClientInfo([
  windowOffset,
  limitPerWindow,
  windowSizeInBlock,
  locked,
]: ReadContractData<typeof onRampABI, "clients", [Address]>): ClientInfo {
  return {
    windowOffset,
    limitPerWindow,
    windowSizeInBlock,
    locked,
  };
}

export function useOnRampClientInfo({
  onRampContractAddress,
  clientAddress,
  refetchOnEvents = false,
}: UseOnRampClientInfoParameters) {
  const { refetch, ...restOfReadContract } = useReadContract({
    address: onRampContractAddress,
    abi: onRampABI,
    functionName: "clients",
    args: [clientAddress],
    query: {
      select: tupleToClientInfo,
    },
  });

  const handleEventLogs = useCallback(() => {
    refetch();
  }, [refetch]);

  useWatchContractEvent({
    address: onRampContractAddress,
    abi: onRampABI,
    eventName: "Locked",
    onLogs: handleEventLogs,
    enabled: refetchOnEvents,
  });

  useWatchContractEvent({
    address: onRampContractAddress,
    abi: onRampABI,
    eventName: "Unlocked",
    onLogs: handleEventLogs,
    enabled: refetchOnEvents,
  });

  useWatchContractEvent({
    address: onRampContractAddress,
    abi: onRampABI,
    eventName: "ClientRateLimitParametersChanged",
    onLogs: handleEventLogs,
    enabled: refetchOnEvents,
  });

  return {
    refetch,
    ...restOfReadContract,
  };
}
