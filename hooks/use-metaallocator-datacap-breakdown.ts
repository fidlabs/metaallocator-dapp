import { type Address } from "viem";
import { useAddressDatacap } from "./useAddressDatacap";
import { useAllocatorsWithAllowance } from "./use-allocators-with-allowance";

export interface UseMetallocatorDatacapBreakdownReturnType {
  data:
    | {
        contractDatacap: bigint;
        allocatedDatacap: bigint;
        unallocatedDatacap: bigint;
      }
    | undefined;
  error: Error | null;
  isLoading: boolean;
}

export function useMetallocatorDatacapBreakdown(
  metaallocatorContractAddress: Address
): UseMetallocatorDatacapBreakdownReturnType {
  const {
    data: contractDatacap,
    error: contractDatacapError,
    isLoading: contractDatacapLoading,
  } = useAddressDatacap(metaallocatorContractAddress);
  const {
    data: allocatedDatacap,
    error: allocatedDatacapError,
    isLoading: allocatedDatacapLoading,
  } = useAllocatorsWithAllowance({
    metaallocatorContractAddress,
    queryOptions: {
      select(data) {
        return Object.values(data).reduce(
          (sum, allowance) => sum + allowance,
          0n
        );
      },
    },
  });

  return {
    data:
      typeof contractDatacap !== "undefined" &&
      typeof allocatedDatacap !== "undefined"
        ? {
            contractDatacap,
            allocatedDatacap,
            unallocatedDatacap: contractDatacap - allocatedDatacap,
          }
        : undefined,
    error: contractDatacapError || allocatedDatacapError,
    isLoading: contractDatacapLoading || allocatedDatacapLoading,
  };
}
