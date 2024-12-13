import { MutatationKey, QueryKey } from "@/constants";
import { isWaitableTransaction } from "@/types/common";
import { SafeClient } from "@safe-global/sdk-starter-kit";
import { useQueryClient } from "@tanstack/react-query";
import useSafeClientMutation from "./useSafeClientMutation";
import useSafeContext from "./useSafeContext";

type ExecuteTransactionInput = Parameters<
  SafeClient["protocolKit"]["executeTransaction"]
>;
type TransactionOrHash = ExecuteTransactionInput[0] | string;

export interface ExecuteSafeTransactionParameters {
  transaction: TransactionOrHash;
  options?: ExecuteTransactionInput[1];
}

export function useExecuteSafeTransaction() {
  const { safeAddress } = useSafeContext();
  const queryClient = useQueryClient();

  return useSafeClientMutation({
    mutationKey: [MutatationKey.EXECUTE_SAFE_TRANSACTION],
    mutationSafeClientFn: async (
      safeClient,
      {
        transaction: transactionOrHash,
        options,
      }: ExecuteSafeTransactionParameters
    ) => {
      const safeTransaction =
        typeof transactionOrHash === "string"
          ? await safeClient.apiKit.getTransaction(transactionOrHash)
          : transactionOrHash;
      const { transactionResponse } =
        await safeClient.protocolKit.executeTransaction(
          safeTransaction,
          options
        );

      if (isWaitableTransaction(transactionResponse)) {
        await transactionResponse.wait();
      }

      queryClient.invalidateQueries({
        queryKey: [QueryKey.SAFE_PENDING_TRANSACTIONS, safeAddress],
      });
    },
  });
}

export default useExecuteSafeTransaction;
