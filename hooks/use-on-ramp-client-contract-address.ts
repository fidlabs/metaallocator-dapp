import onRampABI from "@/abi/OnRamp";
import { type Address } from "viem";
import { useReadContract } from "wagmi";

export type UseOnRampClientContractAddressParameters = {
  onRampContractAddress: Address;
};

export function useOnRampClientContractAddress({
  onRampContractAddress,
}: UseOnRampClientContractAddressParameters) {
  return useReadContract({
    abi: onRampABI,
    address: onRampContractAddress,
    functionName: "CLIENT_CONTRACT",
    query: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
    },
  });
}
