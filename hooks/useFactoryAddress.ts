import {
  FILECOIN_CALIBRATION_FACTORY_ADDRESS,
  FILECOIN_FACTORY_ADDRESS,
} from "@/constants";
import type { Address } from "viem";
import { filecoin, filecoinCalibration } from "viem/chains";
import { useChainId } from "wagmi";

const factoriesMap: Record<number, Address | null> = {
  [filecoin.id]: FILECOIN_FACTORY_ADDRESS,
  [filecoinCalibration.id]: FILECOIN_CALIBRATION_FACTORY_ADDRESS,
};

export function useFactoryAddress(): Address {
  const chainId = useChainId();
  const maybeFactoryAddress = factoriesMap[chainId];

  if (maybeFactoryAddress === null) {
    throw new Error(
      `Factory address is not configured for chain ${chainId.toString()}`
    );
  }

  return maybeFactoryAddress;
}

export default useFactoryAddress;
