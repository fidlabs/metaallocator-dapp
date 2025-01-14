"use client";

import factoryABI from "@/abi/Factory";
import AppLayout from "@/components/AppLayout";
import ContractOwnershipWidget from "@/components/ContractOwnershipWidget";
import FactoryContractDeployWidget from "@/components/FactoryContractDeployWidget";
import FactoryContractsWidget from "@/components/FactoryContractsWidget";
import SafeGuard from "@/components/SafeGuard";
import SafePendingTransactionsList from "@/components/SafePendingTransactionsList";
import SafeProvider from "@/components/SafeProvider";
import SetImplementationWidget from "@/components/SetImplementationWidget";
import useFactoryAddress from "@/hooks/useFactoryAddress";
import useFactoryOwner from "@/hooks/useFactoryOwner";
import type { ReactElement } from "react";
import type { DecodeFunctionDataReturnType } from "viem";

export default function HomePage() {
  const factoryAddress = useFactoryAddress();
  const { data: factoryOwner } = useFactoryOwner();

  return (
    <SafeProvider safeAddress={factoryOwner}>
      <div className="container mx-auto py-6 flex flex-col gap-6 pb-8">
        <div>
          <h1 className="text-lg text-center font-semibold">Factory</h1>
          <p className="text-sm text-center text-muted-foreground">
            {factoryAddress}
          </p>
        </div>
        <FactoryContractsWidget factoryAddress={factoryAddress} />
        <FactoryContractDeployWidget factoryAddress={factoryAddress} />
        <ContractOwnershipWidget contractAddress={factoryAddress} />
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

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

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
