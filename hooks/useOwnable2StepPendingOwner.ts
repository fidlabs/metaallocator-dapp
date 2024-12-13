import ownable2StepABI from "@/abi/Ownable2Step";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export function useOwnable2StepPendingOwner(address: Address) {
  return useReadContract({
    address,
    abi: ownable2StepABI,
    functionName: "pendingOwner",
  });
}

export default useOwnable2StepPendingOwner;
