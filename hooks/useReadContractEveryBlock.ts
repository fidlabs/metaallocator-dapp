import { useCallback, useRef } from "react";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";
import {
  type Config,
  type ResolvedRegister,
  useReadContract,
  UseReadContractParameters,
  useWatchBlockNumber,
} from "wagmi";
import type { ReadContractData } from "wagmi/query";

export type UseReadContractEveryBlockParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    "pure" | "view"
  > = ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<
    abi,
    "pure" | "view",
    functionName
  > = ContractFunctionArgs<abi, "pure" | "view", functionName>,
  config extends Config = Config,
  selectData = ReadContractData<abi, functionName, args>
> = UseReadContractParameters<abi, functionName, args, config, selectData> & {
  throttle?: number;
};

export function useReadContractEveryBlock<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<abi, "pure" | "view", functionName>,
  config extends Config = ResolvedRegister["config"],
  selectData = ReadContractData<abi, functionName, args>
>(
  parameters: UseReadContractEveryBlockParameters<
    abi,
    functionName,
    args,
    config,
    selectData
  >
) {
  const { throttle, ...restOfParameters } = parameters;
  const timestampRef = useRef(0);
  const { refetch, ...restOfUseReadContract } = useReadContract(
    restOfParameters as UseReadContractParameters<
      abi,
      functionName,
      args,
      config,
      selectData
    >
  );

  const handleBlockNumberChange = useCallback(
    (blockNumber: bigint, previousBlockNumber?: bigint) => {
      const previousTimestamp = timestampRef.current;
      const now = Date.now();

      if (typeof throttle === "number" && now - previousTimestamp < throttle) {
        return;
      }

      if (previousBlockNumber === blockNumber) {
        return;
      }

      timestampRef.current = now;
      refetch();
    },
    [refetch, throttle]
  );

  useWatchBlockNumber({
    onBlockNumber: handleBlockNumberChange,
  });

  return {
    refetch,
    ...restOfUseReadContract,
  };
}
