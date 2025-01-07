import { poll } from "@/lib/utils";
import type { Hash } from "viem";
import { useConfig } from "wagmi";
import { waitForTransactionReceipt as waitForTransactionReceiptWagmi } from "wagmi/actions";
import useSafeContext from "./useSafeContext";

type WaitForTransactionIndexedParams = {
  ethereumTxHash?: string;
  safeTxHash?: string;
};

export type UseWaitForTransactionParams = { pollingInterval?: number };
export type UseWaitForTransactionReturnType = {
  waitForTransactionReceipt: (
    ethereumTxHash: string
  ) => ReturnType<typeof waitForTransactionReceiptWagmi>;
  waitForTransactionIndexed: (
    params: WaitForTransactionIndexedParams
  ) => Promise<void>;
};

export function useWaitForTransaction(
  params: UseWaitForTransactionParams = {}
): UseWaitForTransactionReturnType {
  const wagmiConfig = useConfig();
  const { safeAddress, publicSafeClient } = useSafeContext();

  const waitForTransactionReceipt = async (ethereumTxHash: string) => {
    return waitForTransactionReceiptWagmi(wagmiConfig, {
      hash: ethereumTxHash as Hash,
    });
  };

  const waitForTransactionIndexed = async ({
    ethereumTxHash,
    safeTxHash,
  }: WaitForTransactionIndexedParams) => {
    if (!publicSafeClient) {
      throw new Error("Public client is not available");
    }

    if (!ethereumTxHash && !safeTxHash) {
      throw new Error("Either ethereumTxHash or safeTxHash must be provided");
    }

    if (safeTxHash) {
      await poll(
        () =>
          publicSafeClient.apiKit
            .getTransaction(safeTxHash)
            .catch(() => undefined),
        (transaction) => transaction === undefined || !transaction.isExecuted,
        params.pollingInterval
      );
      return;
    }

    if (!safeAddress) {
      throw new Error("Safe address is not available");
    }

    await poll(
      () => publicSafeClient.apiKit.getAllTransactions(safeAddress),
      (transactions) => {
        return !transactions.results.some((tx) => {
          if (
            tx.txType === "MODULE_TRANSACTION" ||
            tx.txType === "MULTISIG_TRANSACTION"
          ) {
            return tx.transactionHash === ethereumTxHash;
          }

          if (tx.txType === "ETHEREUM_TRANSACTION") {
            return tx.txHash === ethereumTxHash;
          }

          return false;
        });
      },
      params.pollingInterval
    );
  };

  return { waitForTransactionReceipt, waitForTransactionIndexed };
}

export default useWaitForTransaction;
