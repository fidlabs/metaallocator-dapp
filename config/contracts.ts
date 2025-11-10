import { TESTNET_ENABLED } from "@/lib/constants";
import { type Address, isAddress, zeroAddress } from "viem";
import { filecoin, filecoinCalibration } from "viem/chains";
import { filecoinDevnet } from "./chains";

interface ContractsConfig {
  factoryAddress: Address;
  beaconProxyFactoryAddress: Address;
}

type ChainId =
  | typeof filecoin.id
  | typeof filecoinCalibration.id
  | typeof filecoinDevnet.id;
type ContractsConfigMap = Map<ChainId, ContractsConfig | null>;

export const contractsConfigMap: ContractsConfigMap = new Map([
  [filecoin.id, loadContractsConfig()],
  [filecoinCalibration.id, TESTNET_ENABLED ? loadContractsConfig(true) : null],
  [
    filecoinDevnet.id,
    {
      factoryAddress: zeroAddress,
      beaconProxyFactoryAddress: zeroAddress,
    },
  ],
]);

export default contractsConfigMap;

function loadContractsConfig(testnet = false): ContractsConfig | null {
  const maybeFactoryAddress = testnet
    ? process.env.NEXT_PUBLIC_FILECOIN_CALIBRATION_FACTORY_ADDRESS
    : process.env.NEXT_PUBLIC_FILECOIN_FACTORY_ADDRESS;
  const factoryAddress = addressOrNull(maybeFactoryAddress);

  if (!factoryAddress) {
    return null;
  }

  const maybeBeaconProxyFactoryAddress = testnet
    ? process.env.NEXT_PUBLIC_FILECOIN_CALIBRATION_BEACON_PROXY_FACTORY_ADDRESS
    : process.env.NEXT_PUBLIC_FILECOIN_BEACON_PROXY_FACTORY_ADDRESS;
  const beaconProxyFactoryAddress = addressOrNull(
    maybeBeaconProxyFactoryAddress
  );

  if (!beaconProxyFactoryAddress) {
    return null;
  }

  return {
    factoryAddress,
    beaconProxyFactoryAddress,
  };
}

function addressOrNull(input: unknown): Address | null {
  if (typeof input !== "string") {
    return null;
  }

  return isAddress(input) ? input : null;
}
