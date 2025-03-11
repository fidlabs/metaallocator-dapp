import { MutatationKey, QueryKey } from "@/lib/constants";
import { SafeClient } from "@safe-global/sdk-starter-kit";
import useInvalidateQueries from "./useInvalidateQueries";
import useSafeClientMutation, {
  UseSafeClientMutationOptions,
} from "./useSafeClientMutation";
import useSafeContext from "./useSafeContext";
import useWaitForTransaction from "./useWaitForTransaction";

type SendTransactionInput = Parameters<SafeClient["send"]>[0];
export type UseSendSafeTransactionOptions = Omit<
  UseSafeClientMutationOptions<string | void, Error, SendTransactionInput>,
  "mutationKey" | "mutationSafeClientFn"
>;

export function useSendSafeTransaction(
  options: UseSendSafeTransactionOptions = {}
) {
  const { safeAddress } = useSafeContext();
  const { waitForTransactionReceipt, waitForTransactionIndexed } =
    useWaitForTransaction();
  const invalidateQueries = useInvalidateQueries();

  return useSafeClientMutation({
    ...options,
    mutationKey: [MutatationKey.SEND_SAFE_TRANSACTION],
    mutationSafeClientFn: async (safeClient, input: SendTransactionInput) => {
      const result = await safeClient.send(input);

      if (result.transactions?.ethereumTxHash) {
        await waitForTransactionReceipt(result.transactions.ethereumTxHash);

        invalidateQueries([[QueryKey.SAFE_PENDING_TRANSACTIONS, safeAddress]]);

        await waitForTransactionIndexed(result.transactions);
        return result.transactions.ethereumTxHash;
      } else if (result.transactions?.safeTxHash) {
        invalidateQueries([[QueryKey.SAFE_PENDING_TRANSACTIONS, safeAddress]]);
      }
    },
  });
}

export default useSendSafeTransaction;
