import ownableABI from "@/abi/Ownable";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export function useOwnableOwner(maybeContractAddress: Address | undefined) {
  return useReadContract({
    address: maybeContractAddress,
    abi: ownableABI,
    functionName: "owner",
    query: {
      enabled: !!maybeContractAddress,
    },
  });
}

export default useOwnableOwner;
