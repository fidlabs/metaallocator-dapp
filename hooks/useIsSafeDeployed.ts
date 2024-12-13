import { QueryKey } from "@/constants";
import { UseQueryResult } from "@tanstack/react-query";
import useSafeClientQuery from "./useSafeClientQuery";
import useSafeContext from "./useSafeContext";

export type UseIsSafeDeployedReturnType = UseQueryResult<boolean>;

export function useIsSafeDeployed(): UseIsSafeDeployedReturnType {
  const { initialized, safeAddress } = useSafeContext();

  return useSafeClientQuery({
    queryKey: [QueryKey.SAFE_IS_DEPLOYED, safeAddress],
    querySafeClientFn: async ({ safeClient }) => {
      const result = await safeClient.isDeployed();
      return result;
    },
    enabled: initialized,
  });
}

export default useIsSafeDeployed;
