import ownable2StepABI from "@/abi/Ownable2Step";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export function useOwnable2StepPendingOwner(address: Address | undefined) {
  return useReadContract({
    address,
    abi: ownable2StepABI,
    functionName: "pendingOwner",
    query: {
      enabled: !!address,
    },
  });
}

export default useOwnable2StepPendingOwner;
