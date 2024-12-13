import allocatorABI from "@/abi/Allocator";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export function useAllocators(allocatorContractAddress: Address) {
  return useReadContract({
    abi: allocatorABI,
    address: allocatorContractAddress,
    functionName: "getAllocators",
  });
}

export default useAllocators;
