"use client";

import allocatorABI from "@/abi/Allocator";
import { useOwnableOwner } from "@/hooks/use-ownable-owner";
import { formatBytes, shortenAddress } from "@/lib/utils";
import type { Address, DecodeFunctionDataReturnType } from "viem";
import AllocatorAllowanceWidget from "./allocator-allowance-widget";
import AllocatorsWidget from "./allocators-widget";
import ContractOwnershipWidget from "./ContractOwnershipWidget";
import SafeGuard from "./SafeGuard";
import SafePendingTransactionsList from "./SafePendingTransactionsList";
import SafeProvider from "./SafeProvider";
import ScreenBreadcrumbs from "./ScreenBreadcrumbs";
import { MetaallocatorDatacapGrid } from "./metaallocator-datacap-grid";
import { UUPSUpgradeableUpgradeWidget } from "./uups-upgradeable-upgrade-widget";

export interface AllocatorDashboardProps {
  allocatorContractAddress: Address;
}

export function AllocatorDashboard({
  allocatorContractAddress,
}: AllocatorDashboardProps) {
  const { data: ownerAddress } = useOwnableOwner({
    contractAddress: allocatorContractAddress,
    refetchOnEvents: true,
  });

  return (
    <SafeProvider safeAddress={ownerAddress}>
      <div className="flex flex-col gap-6">
        <ScreenBreadcrumbs
          items={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Allocators",
              href: "/allocator",
            },
            {
              label: shortenAddress(allocatorContractAddress),
            },
          ]}
        />

        <div>
          <h1 className="text-lg text-center font-semibold">Allocator</h1>
          <p className="text-sm text-center text-muted-foreground">
            {allocatorContractAddress}
          </p>
        </div>
        <MetaallocatorDatacapGrid
          metaallocatorContractAddress={allocatorContractAddress}
        />
        <AllocatorsWidget allocatorContractAddress={allocatorContractAddress} />
        <AllocatorAllowanceWidget
          allocatorContractAddress={allocatorContractAddress}
        />
        <ContractOwnershipWidget
          contractAddress={allocatorContractAddress}
          ownableType="ownable2Step"
        />
        <UUPSUpgradeableUpgradeWidget
          contractAddress={allocatorContractAddress}
        />
        <SafeGuard>
          <SafePendingTransactionsList
            targetFilter={{
              address: allocatorContractAddress,
              abi: allocatorABI,
              formatTransactionTitle,
            }}
          />
        </SafeGuard>
      </div>
    </SafeProvider>
  );
}

function formatTransactionTitle(
  functionData: DecodeFunctionDataReturnType<typeof allocatorABI>
): string | null {
  switch (functionData.functionName) {
    case "acceptOwnership":
      return "Accept ownership of the contract";
    case "transferOwnership":
      return `Transfer ownership of the contract to ${functionData.args[0]}`;
    case "addAllowance":
      return `Increase ${functionData.args[0]} allowance by ${formatBytes(
        functionData.args[1]
      )}`;
    case "setAllowance":
      return `Set ${functionData.args[0]} allowance to ${formatBytes(
        functionData.args[1]
      )}`;
    case "upgradeToAndCall":
      return `Upgrade implementation to ${functionData.args[0]}`;
    default:
      return null;
  }
}

export default AllocatorDashboard;
