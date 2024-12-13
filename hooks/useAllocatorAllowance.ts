import allocatorABI from "@/abi/Allocator";
import type { Address } from "viem";
import { useReadContract } from "wagmi";

export function useAllocatorAllowance(
  allocatorContractAddress: Address,
  allocatorAddress: Address
) {
  return useReadContract({
    abi: allocatorABI,
    address: allocatorContractAddress,
    functionName: "allowance",
    args: [allocatorAddress],
  });
}

export default useAllocatorAllowance;
