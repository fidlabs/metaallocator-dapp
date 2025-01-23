"use client";

import factoryABI from "@/abi/Factory";
import ContractOwnershipWidget from "@/components/ContractOwnershipWidget";
import FactoryContractDeployWidget from "@/components/FactoryContractDeployWidget";
import FactoryContractsWidget from "@/components/FactoryContractsWidget";
import SafeGuard from "@/components/SafeGuard";
import SafePendingTransactionsList from "@/components/SafePendingTransactionsList";
import SafeProvider from "@/components/SafeProvider";
import ScreenBreadcrumbs from "@/components/ScreenBreadcrumbs";
import SetImplementationWidget from "@/components/SetImplementationWidget";
import useFactoryAddress from "@/hooks/useFactoryAddress";
import useFactoryOwner from "@/hooks/useFactoryOwner";
import type { DecodeFunctionDataReturnType } from "viem";

export default function AllocatorPage() {
  const factoryAddress = useFactoryAddress();
  const { data: factoryOwner } = useFactoryOwner();

  return (
    <SafeProvider safeAddress={factoryOwner}>
      <div className="container mx-auto flex flex-col gap-6 pb-8">
        <ScreenBreadcrumbs
          items={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Allocators",
            },
          ]}
        />
        <div>
          <h1 className="text-lg text-center font-semibold">
            Allocator Factory
          </h1>
          <p className="text-sm text-center text-muted-foreground">
            {factoryAddress}
          </p>
        </div>
        <FactoryContractsWidget factoryAddress={factoryAddress} />
        <FactoryContractDeployWidget factoryAddress={factoryAddress} />
        <ContractOwnershipWidget
          contractAddress={factoryAddress}
          ownableType="ownable2Step"
        />
        <SetImplementationWidget contractAddress={factoryAddress} />
        <SafeGuard>
          <SafePendingTransactionsList
            targetFilter={{
              abi: factoryABI,
              address: factoryAddress,
              formatTransactionTitle,
            }}
          />
        </SafeGuard>
      </div>
    </SafeProvider>
  );
}

function formatTransactionTitle(
  functionData: DecodeFunctionDataReturnType<typeof factoryABI>
): string | null {
  switch (functionData.functionName) {
    case "acceptOwnership":
      return "Accept ownership of the contract";
    case "transferOwnership":
      return `Transfer ownership of the contract to ${functionData.args[0]}`;
    case "deploy":
      return `Deploy new allocator contract with ${functionData.args[0]} as an owner`;
    case "setImplementation":
      return `Set contract implementation to ${functionData.args[0]}`;
    default:
      return null;
  }
}
