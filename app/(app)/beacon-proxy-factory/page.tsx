"use client";

import ownableABI from "@/abi/Ownable";
import upgradableBeaconABI from "@/abi/UpgradableBeacon";
import BeaconUpgradeWidget from "@/components/BeaconUpgradeWidget";
import ContractOwnershipWidget from "@/components/ContractOwnershipWidget";
import CreateClientWidget from "@/components/CreateClientWidget";
import ManageClientContractWidget from "@/components/ManageClientContractWidget";
import SafeGuard from "@/components/SafeGuard";
import SafePendingTransactionsList from "@/components/SafePendingTransactionsList";
import SafeProvider from "@/components/SafeProvider";
import useBeaconProxyFactoryAddress from "@/hooks/useBeaconProxyFactoryAddress";
import useBeaconProxyFactoryBeaconAddress from "@/hooks/useBeaconProxyFactoryBeaconAddress";
import useOwnableOwner from "@/hooks/useOwnableOwner";
import { Loader2 } from "lucide-react";
import type { DecodeFunctionDataReturnType } from "viem";
import { useWatchContractEvent } from "wagmi";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <Loader2 className="animate-spin text-dodger-blue" size={48} />
    </div>
  );
}

export default function BeaconProxyFactoryPage() {
  const beaconProxyFactoryAddress = useBeaconProxyFactoryAddress();
  const { data: maybeUpgradableBeaconAddress } =
    useBeaconProxyFactoryBeaconAddress(beaconProxyFactoryAddress);
  const {
    data: maybeUpgradableBeaconOwnerAddress,
    refetch: refetchBeaconOwnerAddress,
  } = useOwnableOwner(maybeUpgradableBeaconAddress);

  useWatchContractEvent({
    abi: ownableABI,
    address: maybeUpgradableBeaconAddress,
    eventName: "OwnershipTransferred",
    onLogs: () => refetchBeaconOwnerAddress(),
  });

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6 pb-8">
      <div>
        <h1 className="text-lg text-center font-semibold">
          Beacon Proxy Factory
        </h1>
        <p className="text-sm text-center text-muted-foreground">
          {beaconProxyFactoryAddress}
        </p>
      </div>

      <ManageClientContractWidget />

      <CreateClientWidget
        beaconProxyFactoryAddress={beaconProxyFactoryAddress}
      />

      {!maybeUpgradableBeaconAddress && <Loader />}

      {!!maybeUpgradableBeaconAddress && (
        <SafeProvider safeAddress={maybeUpgradableBeaconOwnerAddress}>
          <>
            <BeaconUpgradeWidget beaconAddress={maybeUpgradableBeaconAddress} />

            <ContractOwnershipWidget
              contractAddress={maybeUpgradableBeaconAddress}
              ownableType="ownable"
              title="Transfer Beacon ownership"
            />

            <SafeGuard notInitializedFallback={Loader}>
              <SafePendingTransactionsList
                targetFilter={{
                  abi: upgradableBeaconABI,
                  address: maybeUpgradableBeaconAddress,
                  formatTransactionTitle,
                }}
              />
            </SafeGuard>
          </>
        </SafeProvider>
      )}
    </div>
  );
}

function formatTransactionTitle(
  functionData: DecodeFunctionDataReturnType<typeof upgradableBeaconABI>
): string | null {
  switch (functionData.functionName) {
    case "transferOwnership":
      return `Transfer Beacon ownership to ${functionData.args[0]}`;
    case "upgradeTo":
      return `Upgrade Beacon implementation to ${functionData.args[0]}`;
    default:
      return null;
  }
}
