import pauseableABI from "@/abi/Pausable";
import { usePausablePaused } from "@/hooks/use-pausable-paused";
import { Skeleton } from "@fidlabs/common-react-ui";
import type { TransactionBase } from "@safe-global/types-kit";
import { PauseIcon, PlayIcon } from "lucide-react";
import { createElement, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import TransactionButton from "./TransactionButton";

export interface ContractPauseWidgetProps {
  contractAddress: Address;
  disabled?: boolean;
}

export function ContractPauseWidget({
  contractAddress,
  disabled = false,
}: ContractPauseWidgetProps) {
  const { data: paused, isPending } = usePausablePaused({
    contractAddress,
    refetchOnEvents: true,
  });

  const transaction = useMemo<TransactionBase | null>(() => {
    return {
      to: contractAddress,
      data: encodeFunctionData({
        abi: pauseableABI,
        functionName: paused ? "unpause" : "pause",
        args: [],
      }),
      value: "0",
    };
  }, [contractAddress, paused]);

  const handleTransactionSuccess = useCallback(
    (txHash?: string) => {
      toast.success(
        txHash
          ? `Contract ${paused ? "unpaused" : "paused"}`
          : `Contract ${paused ? "unpause" : "pause"} waiting for Safe confirmation.`
      );
    },
    [paused]
  );

  return (
    <div className="bg-white shadow-f-card rounded-xl p-6 flex justify-between items-center">
      {isPending ? (
        <Skeleton className="h-6 w-[200px]" />
      ) : (
        <p>
          Contract is <strong>{paused ? "paused" : "not paused"}</strong>.
        </p>
      )}

      <TransactionButton
        disabled={disabled || isPending}
        transaction={transaction}
        onSuccess={handleTransactionSuccess}
      >
        {createElement(paused ? PlayIcon : PauseIcon, { className: "h-4 w-4" })}
        {paused ? "Unpause" : "Pause"}
      </TransactionButton>
    </div>
  );
}
