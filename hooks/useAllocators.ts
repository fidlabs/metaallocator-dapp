import allocatorABI from "@/abi/Allocator";
import { Address } from "viem";
import { useReadContractEveryBlock } from "./useReadContractEveryBlock";

export function useAllocators(allocatorContractAddress: Address) {
  return useReadContractEveryBlock({
    abi: allocatorABI,
    address: allocatorContractAddress,
    functionName: "getAllocators",
    throttle: 5000,
  });
}

export default useAllocators;
