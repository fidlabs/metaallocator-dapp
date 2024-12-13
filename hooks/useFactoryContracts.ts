import factoryABI from "@/abi/Factory";
import type { Address } from "viem";
import { useReadContract } from "wagmi";

export function useFactoryContracts(factoryAddress: Address) {
  return useReadContract({
    abi: factoryABI,
    address: factoryAddress,
    functionName: "getContracts",
  });
}

export default useFactoryContracts;