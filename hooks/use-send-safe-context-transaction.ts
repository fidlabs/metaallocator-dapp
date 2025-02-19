import { useCallback, useEffect, useState } from "react";
import useSafeContext from "./useSafeContext";
import type { Hex, TransactionBase } from "@safe-global/types-kit";
import useSendSafeTransaction from "./useSendSafeTransaction";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import type { Address } from "viem";

export interface UseSendSafeContextTransactionOptions {
  onError?(error: Error): void;
  onSuccess?(ethereumTransactionHash: string | void): void;
  onTransactionHash?(trasnsactionHash: Hex): void;
}

export function useSendSafeContextTransaction(
  options?: UseSendSafeContextTransactionOptions
) {
  const { onError, onSuccess, onTransactionHash } = options ?? {};
  const [watchedTransactionHash, setWatchedTransactionHash] = useState<Hex>();
  const { connected, deployed, initialized } = useSafeContext();

  const handleSendEthereumTransaction = useCallback(() => {
    setWatchedTransactionHash(undefined);
  }, []);

  const handleSendEthereumTransactionSuccess = useCallback(
    (nextTransactionHash: Hex) => {
      setWatchedTransactionHash(nextTransactionHash);
      onTransactionHash?.(nextTransactionHash);
    },
    [onTransactionHash]
  );

  // Safe transactions
  const { mutate: sendSafeTransaction, status: sendSafeTransactionStatus } =
    useSendSafeTransaction({
      onSuccess,
      onError,
    });

  // Regular Ethereum transactions
  const {
    sendTransaction: sendEthereumTransaction,
    status: sendEthereumTransactionStatus,
  } = useSendTransaction({
    mutation: {
      onMutate: handleSendEthereumTransaction,
      onSuccess: handleSendEthereumTransactionSuccess,
      onError,
    },
  });

  const { error: watchError, status: watchStatus } =
    useWaitForTransactionReceipt({
      hash: watchedTransactionHash,
      query: {
        enabled: typeof watchedTransactionHash !== "undefined",
      },
    });

  const sendTransaction = useCallback(
    (transaction: TransactionBase) => {
      if (!initialized) {
        throw new Error(
          "Safe context not initialized, cannot send transaction."
        );
      }

      if (!connected) {
        throw new Error("Wallet not connected, cannot send transaction.");
      }

      if (deployed) {
        sendSafeTransaction({
          transactions: [transaction],
        });
      } else {
        sendEthereumTransaction({
          to: transaction.to as Address,
          data: transaction.data as Hex,
          value: BigInt(transaction.value),
        });
      }
    },
    [connected, deployed, initialized]
  );

  // If watched Ethereum transaction ended in error clear hash and trigger callback
  useEffect(() => {
    if (watchError) {
      setWatchedTransactionHash(undefined);
      onError?.(watchError);
    }
  }, [onError, watchError]);

  // If watched Ethereum transaction ended in success clear hash and trigger callback
  useEffect(() => {
    if (!!watchedTransactionHash && watchStatus === "success") {
      onSuccess?.(watchedTransactionHash);
      setWatchedTransactionHash(undefined);
    }
  }, [onSuccess, watchStatus, watchedTransactionHash]);

  const safeTransactionInProgress = sendSafeTransactionStatus === "pending";
  const ethereumTransactionInProgress =
    sendEthereumTransactionStatus === "pending" ||
    (!!watchedTransactionHash && watchStatus === "pending");

  return {
    sendTransaction,
    transactionInProgress:
      safeTransactionInProgress || ethereumTransactionInProgress,
  };
}
