import factoryABI from "@/abi/Factory";
import { useReadContract } from "wagmi";
import useFactoryAddress from "./useFactoryAddress";

export function useFactoryPendingOwner() {
  const factoryAddress = useFactoryAddress();

  return useReadContract({
    abi: factoryABI,
    address: factoryAddress,
    functionName: "pendingOwner",
  });
}

export default useFactoryPendingOwner;
