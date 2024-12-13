import ownable2StepABI from "@/abi/Ownable2Step";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export function useOwnable2StepOwner(address: Address) {
  return useReadContract({
    address,
    abi: ownable2StepABI,
    functionName: "owner",
  });
}

export default useOwnable2StepOwner;
