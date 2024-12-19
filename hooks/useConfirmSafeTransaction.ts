import { MutatationKey, QueryKey } from "@/constants";
import useInvalidateQueries from "./useInvalidateQueries";
import useSafeClientMutation, {
  UseSafeClientMutationOptions,
} from "./useSafeClientMutation";
import useSafeContext from "./useSafeContext";
import useWaitForTransaction from "./useWaitForTransaction";

interface ConfirmTransactionInput {
  safeTxHash: string;
}

export type UseConfirmSafeTransactionOptions = Omit<
  UseSafeClientMutationOptions<void, Error, ConfirmTransactionInput>,
  "mutationKey" | "mutationSafeClientFn"
>;

export function useConfirmSafeTransaction(
  options: UseConfirmSafeTransactionOptions = {}
) {
  const { safeAddress } = useSafeContext();
  const { waitForTransactionReceipt, waitForTransactionIndexed } =
    useWaitForTransaction();
  const invalidateQueries = useInvalidateQueries();

  return useSafeClientMutation({
    ...options,
    mutationKey: [MutatationKey.CONFIRM_SAFE_TRANSACTION],
    mutationSafeClientFn: async (
      safeClient,
      { safeTxHash }: ConfirmTransactionInput
    ) => {
      const result = await safeClient.confirm({
        safeTxHash,
      });

      if (result.transactions?.ethereumTxHash) {
        await waitForTransactionReceipt(result.transactions.ethereumTxHash);

        invalidateQueries([[QueryKey.SAFE_PENDING_TRANSACTIONS, safeAddress]]);

        await waitForTransactionIndexed(result.transactions);
      } else if (result.transactions?.safeTxHash) {
        invalidateQueries([[QueryKey.SAFE_PENDING_TRANSACTIONS, safeAddress]]);
      }
    },
  });
}

export default useConfirmSafeTransaction;
