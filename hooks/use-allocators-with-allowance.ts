import allocatorABI from "@/abi/Allocator";
import { QueryKey } from "@/lib/constants";
import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  type QueryFunction,
} from "@tanstack/react-query";
import { useCallback } from "react";
import {
  type Address,
  type ContractFunctionParameters,
  type WatchContractEventOnLogsFn,
} from "viem";
import { useChainId, useConfig, useWatchContractEvent } from "wagmi";
import { readContract, readContracts } from "wagmi/actions";

type AllocatorsAllowanceMap = Record<Address, bigint>;
type AllowanceChangedLogsFn = WatchContractEventOnLogsFn<
  typeof allocatorABI,
  "AllowanceChanged"
>;
type DatacapAllocatedLogsFn = WatchContractEventOnLogsFn<
  typeof allocatorABI,
  "DatacapAllocated"
>;
type UseAllocatorsWithAllowanceQueryKey = [
  QueryKey.ALLOCATORS_WITH_ALLOWANCE,
  metallocatorContractAddress: Address,
];
type UseAllocatorsWithAllowanceQueryOptions<TData = AllocatorsAllowanceMap> =
  Omit<
    UseQueryOptions<
      AllocatorsAllowanceMap,
      Error,
      TData,
      UseAllocatorsWithAllowanceQueryKey
    >,
    "queryFn" | "queryKey"
  >;
export interface UseAllocatorsWithAllowanceParameters<
  TData = AllocatorsAllowanceMap,
> {
  metaallocatorContractAddress: Address;
  queryOptions?: UseAllocatorsWithAllowanceQueryOptions<TData>;
}

export function useAllocatorsWithAllowance<TData>({
  metaallocatorContractAddress,
  queryOptions,
}: UseAllocatorsWithAllowanceParameters<TData>) {
  const chainId = useChainId();
  const config = useConfig();
  const queryClient = useQueryClient();

  const handleAllowanceChangedEvents = useCallback<AllowanceChangedLogsFn>(
    (logs) => {
      const queryKey: UseAllocatorsWithAllowanceQueryKey = [
        QueryKey.ALLOCATORS_WITH_ALLOWANCE,
        metaallocatorContractAddress,
      ];

      queryClient.setQueryData<AllocatorsAllowanceMap>(
        queryKey,
        (queryData) => {
          return logs.reduce<AllocatorsAllowanceMap>((result, log) => {
            if (
              typeof log.args.allocator === "undefined" ||
              typeof log.args.allowanceAfter === "undefined"
            ) {
              return result;
            }

            return {
              ...result,
              [log.args.allocator]: log.args.allowanceAfter,
            };
          }, queryData ?? {});
        }
      );
    },
    [metaallocatorContractAddress, queryClient]
  );

  const handleDatacapAllocatedEvents = useCallback<DatacapAllocatedLogsFn>(
    (logs) => {
      const queryKey: UseAllocatorsWithAllowanceQueryKey = [
        QueryKey.ALLOCATORS_WITH_ALLOWANCE,
        metaallocatorContractAddress,
      ];

      queryClient.setQueryData<AllocatorsAllowanceMap>(
        queryKey,
        (queryData) => {
          return logs.reduce<AllocatorsAllowanceMap>((result, log) => {
            if (
              typeof log.args.allocator === "undefined" ||
              typeof log.args.amount === "undefined" ||
              typeof result[log.args.allocator] === "undefined"
            ) {
              return result;
            }

            return {
              ...result,
              [log.args.allocator]:
                result[log.args.allocator] - log.args.amount,
            };
          }, queryData ?? {});
        }
      );
    },
    [metaallocatorContractAddress, queryClient]
  );

  const queryFn = useCallback<
    QueryFunction<AllocatorsAllowanceMap, UseAllocatorsWithAllowanceQueryKey>
  >(
    async ({ queryKey }) => {
      const [, metaallocatorContractAddress] = queryKey;

      const allocatorsAddresses = await readContract(config, {
        address: metaallocatorContractAddress,
        abi: allocatorABI,
        chainId,
        functionName: "getAllocators",
      });

      const allowanceCalls = allocatorsAddresses.map<
        ContractFunctionParameters<typeof allocatorABI, "view", "allowance">
      >((allocatorAddress) => {
        return {
          address: metaallocatorContractAddress,
          abi: allocatorABI,
          chainId,
          functionName: "allowance",
          args: [allocatorAddress],
        };
      });

      const allowances = await readContracts(config, {
        allowFailure: false,
        contracts: allowanceCalls,
      });

      return allocatorsAddresses.reduce<AllocatorsAllowanceMap>(
        (result, allocatorAddress, index) => {
          const allowance = allowances[index];

          if (typeof allowance !== "bigint") {
            return result;
          }

          return {
            ...result,
            [allocatorAddress]: allowance,
          };
        },
        {}
      );
    },
    [chainId, config]
  );

  useWatchContractEvent({
    abi: allocatorABI,
    address: metaallocatorContractAddress,
    eventName: "AllowanceChanged",
    onLogs: handleAllowanceChangedEvents,
  });

  useWatchContractEvent({
    abi: allocatorABI,
    address: metaallocatorContractAddress,
    eventName: "DatacapAllocated",
    onLogs: handleDatacapAllocatedEvents,
  });

  return useQuery({
    ...queryOptions,
    queryFn,
    queryKey: [
      QueryKey.ALLOCATORS_WITH_ALLOWANCE,
      metaallocatorContractAddress,
    ],
  });
}
