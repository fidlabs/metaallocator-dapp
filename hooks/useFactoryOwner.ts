import factoryABI from "@/abi/Factory";
import useFactoryAddress from "./useFactoryAddress";
import { useReadContractEveryBlock } from "./useReadContractEveryBlock";

export function useFactoryOwner() {
  const factoryAddress = useFactoryAddress();

  return useReadContractEveryBlock({
    abi: factoryABI,
    address: factoryAddress,
    functionName: "owner",
    throttle: 5000,
  });
}

export default useFactoryOwner;
