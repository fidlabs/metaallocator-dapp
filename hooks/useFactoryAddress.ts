import contractsConfigMap from "@/config/contracts";
import type { Address } from "viem";
import { filecoin, filecoinCalibration } from "viem/chains";
import { useChainId } from "wagmi";

export function useFactoryAddress(): Address {
  const chainId = useChainId();
  const maybeFactoryAddress = extractFactoryAddress(chainId);

  if (typeof maybeFactoryAddress !== "string") {
    throw new Error(
      `Factory address is not configured for chain ${chainId.toString()}`
    );
  }

  return maybeFactoryAddress;
}

function extractFactoryAddress(chainId: number): Address | undefined {
  if (chainId === filecoin.id || chainId === filecoinCalibration.id) {
    return contractsConfigMap.get(chainId)?.factoryAddress;
  }
}

export default useFactoryAddress;
