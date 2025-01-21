import contractsConfigMap from "@/config/contracts";
import type { Address } from "viem";
import { filecoin, filecoinCalibration } from "viem/chains";
import { useChainId } from "wagmi";

export function useBeaconProxyFactoryAddress(): Address {
  const chainId = useChainId();
  const maybeBeaconProxyFactoryAddress =
    extractBeaconProxyFactoryAddress(chainId);

  if (typeof maybeBeaconProxyFactoryAddress !== "string") {
    throw new Error(
      `BeaconProxyFactory address is not configured for chain ${chainId.toString()}`
    );
  }

  return maybeBeaconProxyFactoryAddress;
}

function extractBeaconProxyFactoryAddress(
  chainId: number
): Address | undefined {
  if (chainId === filecoin.id || chainId === filecoinCalibration.id) {
    return contractsConfigMap.get(chainId)?.beaconProxyFactoryAddress;
  }
}

export default useBeaconProxyFactoryAddress;
