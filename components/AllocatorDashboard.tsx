"use client";

import allocatorABI from "@/abi/Allocator";
import useOwnable2StepOwner from "@/hooks/useOwnable2StepOwner";
import { formatBytes } from "@/lib/utils";
import type { Address, DecodeFunctionDataReturnType } from "viem";
import AllocatorAllowanceWidget from "./AllocatorAllowanceWidget";
import AllocatorsWidget from "./AllocatorsWidget";
import SafeGuard from "./SafeGuard";
import SafePendingTransactionsList from "./SafePendingTransactionsList";
import SafeProvider from "./SafeProvider";
import ContractOwnershipWidget from "./ContractOwnershipWidget";

export interface AllocatorDashboardProps {
  allocatorContractAddress: Address;
}

export function AllocatorDashboard({
  allocatorContractAddress,
}: AllocatorDashboardProps) {
  const { data: ownerAddress } = useOwnable2StepOwner(allocatorContractAddress);

  return (
    <SafeProvider safeAddress={ownerAddress}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-lg text-center font-semibold">Allocator</h1>
          <p className="text-sm text-center text-muted-foreground">
            {allocatorContractAddress}
          </p>
        </div>
        <AllocatorsWidget allocatorContractAddress={allocatorContractAddress} />
        <AllocatorAllowanceWidget
          allocatorContractAddress={allocatorContractAddress}
        />
        <ContractOwnershipWidget contractAddress={allocatorContractAddress} />
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
    default:
      return null;
  }
}

export default AllocatorDashboard;
