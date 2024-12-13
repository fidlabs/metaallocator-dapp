import factoryABI from "@/abi/Factory";
import { useReadContract } from "wagmi";
import useFactoryAddress from "./useFactoryAddress";

export function useFactoryOwner() {
  const factoryAddress = useFactoryAddress();

  return useReadContract({
    abi: factoryABI,
    address: factoryAddress,
    functionName: "owner",
  });
}

export default useFactoryOwner;
