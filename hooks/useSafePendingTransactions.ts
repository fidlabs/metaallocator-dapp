import { QueryKey } from "@/lib/constants";
import { SafeClient } from "@safe-global/sdk-starter-kit";
import { UseQueryResult } from "@tanstack/react-query";
import useSafeClientQuery from "./useSafeClientQuery";
import useSafeContext from "./useSafeContext";

type SafeMultisigTransactions = Awaited<
  ReturnType<SafeClient["getPendingTransactions"]>
>["results"];
export type UsePendingTransactionsReturnType =
  UseQueryResult<SafeMultisigTransactions>;

export function useSafePendingTransactions(): UsePendingTransactionsReturnType {
  const { safeAddress } = useSafeContext();

  return useSafeClientQuery({
    queryKey: [QueryKey.SAFE_PENDING_TRANSACTIONS, safeAddress],
    querySafeClientFn: async ({ safeClient }) => {
      const { results } = await safeClient.getPendingTransactions();
      return results;
    },
  });
}

export default useSafePendingTransactions;
