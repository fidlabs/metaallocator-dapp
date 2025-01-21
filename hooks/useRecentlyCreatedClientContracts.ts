import beaconProxyFactoryABI from "@/abi/BeaconProxyFactory";
import { useState } from "react";
import type { Address } from "viem";
import { useWatchContractEvent } from "wagmi";

type Item = Address;

export function useRecentlyCreatedClientContracts(
  beaconProxyFactoryAddress: Address
) {
  const [data, setData] = useState<Item[]>([]);

  useWatchContractEvent({
    abi: beaconProxyFactoryABI,
    address: beaconProxyFactoryAddress,
    eventName: "ProxyCreated",
    onLogs(logs) {
      setData((currentData) => {
        return [
          ...currentData,
          ...logs
            .map((item) => item.args.proxy)
            .filter((maybeAddress): maybeAddress is Address => !!maybeAddress),
        ];
      });
    },
  });

  return data;
}

export default useRecentlyCreatedClientContracts;
