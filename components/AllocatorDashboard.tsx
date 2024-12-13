"use client";

import useOwnable2StepOwner from "@/hooks/useOwnable2StepOwner";
import type { Address } from "viem";
import AllocatorAllowanceWidget from "./AllocatorAllowanceWidget";
import AllocatorsWidget from "./AllocatorsWidget";
import SafePendingTransactionsList from "./SafePendingTransactionsList";
import SafeProvider from "./SafeProvider";
import allocatorABI from "@/abi/Allocator";

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
          <p className="text-center text-muted-foreground">
            Owner: {ownerAddress ?? "-"}
          </p>
        </div>
        <AllocatorsWidget allocatorContractAddress={allocatorContractAddress} />
        <AllocatorAllowanceWidget
          allocatorContractAddress={allocatorContractAddress}
        />
        <SafePendingTransactionsList
          targetFilter={{
            address: allocatorContractAddress,
            abi: allocatorABI,
          }}
        />
      </div>
    </SafeProvider>
  );
}

export default AllocatorDashboard;
