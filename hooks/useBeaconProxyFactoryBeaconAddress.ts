import beaconProxyFactoryABI from "@/abi/BeaconProxyFactory";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export function useBeaconProxyFactoryBeaconAddress(
  beaconProxyFactoryAddress: Address
) {
  return useReadContract({
    address: beaconProxyFactoryAddress,
    abi: beaconProxyFactoryABI,
    functionName: "BEACON",
  });
}

export default useBeaconProxyFactoryBeaconAddress;
