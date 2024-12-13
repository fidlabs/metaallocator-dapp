import { MutatationKey, QueryKey } from "@/constants";
import { SafeClient } from "@safe-global/sdk-starter-kit";
import { useQueryClient } from "@tanstack/react-query";
import useSafeClientMutation, {
  UseSafeClientMutationOptions,
} from "./useSafeClientMutation";
import useSafeContext from "./useSafeContext";

type SendTransactionInput = Parameters<SafeClient["send"]>[0];
export type UseSendSafeTransactionOptions = Omit<
  UseSafeClientMutationOptions<void, Error, SendTransactionInput>,
  "mutationKey" | "mutationSafeClientFn"
>;

export function useSendSafeTransaction(
  options: UseSendSafeTransactionOptions = {}
) {
  const { safeAddress } = useSafeContext();
  const queryClient = useQueryClient();

  return useSafeClientMutation({
    ...options,
    mutationKey: [MutatationKey.SEND_SAFE_TRANSACTION],
    mutationSafeClientFn: async (safeClient, input: SendTransactionInput) => {
      await safeClient.send(input);

      queryClient.invalidateQueries({
        queryKey: [QueryKey.SAFE_PENDING_TRANSACTIONS, safeAddress],
      });
    },
  });
}

export default useSendSafeTransaction;
