import type { SafeClient } from "@safe-global/sdk-starter-kit";
import {
  QueryFunction,
  type QueryFunctionContext,
  type QueryKey,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useCallback } from "react";
import useSafeContext from "./useSafeContext";

export type QuerySafeClientFunctionContext<
  TQueryKey extends QueryKey = QueryKey
> = QueryFunctionContext<TQueryKey> & {
  safeClient: SafeClient;
};
export type UseSafeClientQueryOptions<
  TData = unknown,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey
> = Omit<UseQueryOptions<TData, TError, TQueryKey>, "queryFn"> & {
  querySafeClientFn: (
    context: QuerySafeClientFunctionContext<TQueryKey>
  ) => Promise<TData> | TData;
};

export function useSafeClientQuery<
  TData = unknown,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey
>({
  querySafeClientFn,
  ...options
}: UseSafeClientQueryOptions<TData, TError, TQueryKey>) {
  const { publicSafeClient } = useSafeContext();

  const queryFn = useCallback<QueryFunction<TData, TQueryKey>>(
    (context) => {
      if (!publicSafeClient) {
        throw new Error("Public Safe client not initialized.");
      }

      return querySafeClientFn({
        ...context,
        safeClient: publicSafeClient,
      });
    },
    [publicSafeClient, querySafeClientFn]
  );

  return useQuery<TData, TError, TData, TQueryKey>({
    ...(options as UseQueryOptions<TData, TError, TData, TQueryKey>),
    queryFn,
  });
}

export default useSafeClientQuery;
