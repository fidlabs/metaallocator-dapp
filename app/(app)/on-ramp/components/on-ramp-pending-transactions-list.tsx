"use client";

import onRampABI from "@/abi/OnRamp";
import SafeGuard from "@/components/SafeGuard";
import SafePendingTransactionsList from "@/components/SafePendingTransactionsList";
import { shortenAddress } from "@/lib/utils";
import { filesize } from "filesize";
import { useCallback } from "react";
import { type Address, type DecodeFunctionDataReturnType } from "viem";
import { filecoinCalibration } from "viem/chains";
import { useChainId } from "wagmi";

export interface OnRampPendingTransactionsListProps {
  onRampContractAddress: Address;
}

export function OnRampPendingTransactionsList({
  onRampContractAddress,
}: OnRampPendingTransactionsListProps) {
  const chainId = useChainId();

  const formatTransactionTitle = useCallback(
    (functionData: DecodeFunctionDataReturnType<typeof onRampABI>) => {
      const chainPrefix = chainId === filecoinCalibration.id ? "t0" : "f0";
      switch (functionData.functionName) {
        case "setInitialRateLimitParameters":
          return `Change initial rate limit parameters to ${filesize(functionData.args[1], { standard: "iec" })} per ${functionData.args[0].toString()} blocks`;
        case "setClientRateLimitParameters":
          return `Chang rate limit parameters for client ${shortenAddress(functionData.args[0])} to ${filesize(functionData.args[2], { standard: "iec" })} per ${functionData.args[1].toString()} blocks`;
        case "increaseAllowance":
          return `Increase ${shortenAddress(functionData.args[0])} allowance by ${filesize(functionData.args[1], { standard: "iec" })}`;
        case "decreaseAllowance":
          return `Decrease ${shortenAddress(functionData.args[0])} allowance by ${filesize(functionData.args[1], { standard: "iec" })}`;
        case "addAllowedSPsForClient":
          return `Add ${functionData.args[1].map((id) => chainPrefix + id.toString()).join(", ")} to allowed SPs for client ${shortenAddress(functionData.args[0])}`;
        case "removeAllowedSPsForClient":
          return `Remove ${functionData.args[1].map((id) => chainPrefix + id.toString()).join(", ")} from allowed SPs for client ${shortenAddress(functionData.args[0])}`;
        case "setClientMaxDeviationFromFairDistribution":
          return `Set ${shortenAddress(functionData.args[0])} max deviation to ${(Number(functionData.args[1]) / 100).toFixed(2)}%`;
        case "lock":
          return functionData.args[1] > 0n
            ? `Lock client ${shortenAddress(functionData.args[0])} and decrease their allowance by ${filesize(functionData.args[1], { standard: "iec" })}`
            : `Lock client ${shortenAddress(functionData.args[0])}`;
        case "unlock":
          return `Unlock client ${shortenAddress(functionData.args[0])}`;
        case "pause":
          return "Pause contract";
        case "unpause":
          return "Unpause contract";
        default:
          return null;
      }
    },
    [chainId]
  );

  return (
    <SafeGuard>
      <SafePendingTransactionsList
        targetFilter={{
          abi: onRampABI,
          address: onRampContractAddress,
          formatTransactionTitle,
        }}
      />
    </SafeGuard>
  );
}
