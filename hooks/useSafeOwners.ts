import { QueryKey } from "@/lib/constants";
import { UseQueryResult } from "@tanstack/react-query";
import { Address } from "viem";
import useSafeClientQuery from "./useSafeClientQuery";

export type UsePendingTransactionsReturnType = UseQueryResult<Address[]>;

export function useSafeOwners(
  safeAddress: string | undefined
): UsePendingTransactionsReturnType {
  return useSafeClientQuery({
    queryKey: [QueryKey.SAFE_OWNERS, safeAddress],
    querySafeClientFn: async ({ safeClient }) => {
      const owners = await safeClient.getOwners();
      return owners as Address[];
    },
    enabled: !!safeAddress,
    staleTime: Infinity,
  });
}

export default useSafeOwners;
