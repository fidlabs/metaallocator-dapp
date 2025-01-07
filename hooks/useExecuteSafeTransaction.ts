import { MutatationKey, QueryKey } from "@/constants";
import { isWaitableTransaction } from "@/types/common";
import { SafeClient } from "@safe-global/sdk-starter-kit";
import useInvalidateQueries from "./useInvalidateQueries";
import useSafeClientMutation, {
  UseSafeClientMutationOptions,
} from "./useSafeClientMutation";
import useSafeContext from "./useSafeContext";

type ExecuteTransactionInput = Parameters<
  SafeClient["protocolKit"]["executeTransaction"]
>;
type TransactionOrHash = ExecuteTransactionInput[0] | string;

export interface ExecuteSafeTransactionParameters {
  transaction: TransactionOrHash;
  options?: ExecuteTransactionInput[1];
}

export type UseExecuteSafeTransactionOptions = Omit<
  UseSafeClientMutationOptions<void, Error, ExecuteSafeTransactionParameters>,
  "mutationKey" | "mutationSafeClientFn"
>;

export function useExecuteSafeTransaction(
  options: UseExecuteSafeTransactionOptions = {}
) {
  const { safeAddress } = useSafeContext();
  const invalidateQueries = useInvalidateQueries();

  return useSafeClientMutation({
    ...options,
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

      invalidateQueries([[QueryKey.SAFE_PENDING_TRANSACTIONS, safeAddress]]);
    },
  });
}

export default useExecuteSafeTransaction;
