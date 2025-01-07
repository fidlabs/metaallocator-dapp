import allocatorABI from "@/abi/Allocator";
import type { Address } from "viem";
import { useReadContractEveryBlock } from "./useReadContractEveryBlock";

export function useAllocatorAllowance(
  allocatorContractAddress: Address,
  allocatorAddress: Address
) {
  return useReadContractEveryBlock({
    abi: allocatorABI,
    address: allocatorContractAddress,
    functionName: "allowance",
    args: [allocatorAddress],
    throttle: 5000,
  });
}

export default useAllocatorAllowance;
