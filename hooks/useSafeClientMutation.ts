import type { SafeClient } from "@safe-global/sdk-starter-kit";
import {
  MutationFunction,
  MutationOptions,
  useMutation,
} from "@tanstack/react-query";
import { useCallback } from "react";
import useSafeContext from "./useSafeContext";

export type UseSafeClientMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
> = Omit<MutationOptions<TData, TError, TVariables, TContext>, "mutationFn"> & {
  mutationSafeClientFn: (
    client: SafeClient,
    variables: TVariables
  ) => Promise<TData>;
};

export function useSafeClientMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
>({
  mutationSafeClientFn,
  ...options
}: UseSafeClientMutationOptions<TData, TError, TVariables, TContext>) {
  const { signerSafeClient } = useSafeContext();

  const mutationFn = useCallback<MutationFunction<TData, TVariables>>(
    (variables) => {
      if (!signerSafeClient) {
        throw new Error("Signer Safe client not initialized.");
      }

      return mutationSafeClientFn(signerSafeClient, variables);
    },
    [mutationSafeClientFn, signerSafeClient]
  );

  return useMutation({
    ...options,
    mutationFn,
  });
}

export default useSafeClientMutation;
