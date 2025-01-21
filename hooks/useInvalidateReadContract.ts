import { useCallback } from "react";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";
import type { Config } from "wagmi";
import { ReadContractOptions, readContractQueryKey } from "wagmi/query";
import useInvalidateQueries from "./useInvalidateQueries";

export function useInvaldateReadContract() {
  const invalidateQueries = useInvalidateQueries();
  const invalidateReadContract = useCallback(
    <
      abi extends Abi | readonly unknown[],
      functionName extends ContractFunctionName<abi, "pure" | "view">,
      args extends ContractFunctionArgs<abi, "pure" | "view", functionName>,
      config extends Config,
    >(
      options: ReadContractOptions<abi, functionName, args, config>
    ) => {
      const queryKey = readContractQueryKey<config, abi, functionName, args>(
        options
      );
      invalidateQueries([queryKey]);
    },
    [invalidateQueries]
  );

  return invalidateReadContract;
}

export default useInvaldateReadContract;
