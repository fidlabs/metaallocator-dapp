import {
  InvalidateQueryFilters,
  QueryKey,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";

type Options = Omit<InvalidateQueryFilters, "queryKey">;

export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  const invalidateQueries = useCallback(
    (queryKeys: QueryKey[], options?: Options) => {
      queryKeys.forEach((queryKey) => {
        queryClient.invalidateQueries({
          queryKey,
          ...options,
        });
      });
    },
    [queryClient]
  );

  return invalidateQueries;
}

export default useInvalidateQueries;
