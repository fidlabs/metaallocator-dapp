import useFactoryAddress from "./useFactoryAddress";
import { useOwnableOwner } from "./use-ownable-owner";

export function useFactoryOwner() {
  const factoryAddress = useFactoryAddress();

  return useOwnableOwner({
    contractAddress: factoryAddress,
    refetchOnEvents: true,
  });
}
