import { MutatationKey, QueryKey } from "@/constants";
import { useQueryClient } from "@tanstack/react-query";
import useSafeClientMutation from "./useSafeClientMutation";
import useSafeContext from "./useSafeContext";

interface ConfirmTransactionInput {
  safeTxHash: string;
}

export function useConfirmSafeTransaction() {
  const { safeAddress } = useSafeContext();
  const queryClient = useQueryClient();

  return useSafeClientMutation({
    mutationKey: [MutatationKey.CONFIRM_SAFE_TRANSACTION],
    mutationSafeClientFn: async (
      safeClient,
      { safeTxHash }: ConfirmTransactionInput
    ) => {
      await safeClient.confirm({
        safeTxHash,
      });

      queryClient.invalidateQueries({
        queryKey: [QueryKey.SAFE_PENDING_TRANSACTIONS, safeAddress],
      });
    },
  });
}

export default useConfirmSafeTransaction;
