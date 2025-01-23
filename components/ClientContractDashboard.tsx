"use client";

import clientABI from "@/abi/Client";
import ClientAllowanceWidget from "@/components/ClientAllowanceWidget";
import ContractOwnershipWidget from "@/components/ContractOwnershipWidget";
import SafeGuard from "@/components/SafeGuard";
import SafePendingTransactionsList from "@/components/SafePendingTransactionsList";
import SafeProvider from "@/components/SafeProvider";
import { Button } from "@/components/ui/button";
import useOwnableOwner from "@/hooks/useOwnableOwner";
import { formatBytes, shortenAddress } from "@/lib/utils";
import Link from "next/link";
import { type Address, type DecodeFunctionDataReturnType } from "viem";
import ScreenBreadcrumbs from "./ScreenBreadcrumbs";

export interface ClientContractDashboardProps {
  clientContractAddress: Address;
}

export default function ClientContractDashboard({
  clientContractAddress,
}: ClientContractDashboardProps) {
  const { data: clientContractOwner } = useOwnableOwner(clientContractAddress);

  return (
    <div className="container mx-auto flex flex-col gap-6 pb-10">
      <ScreenBreadcrumbs
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Clients",
            href: "/beacon-proxy-factory",
          },
          {
            label: shortenAddress(clientContractAddress),
          },
        ]}
      />

      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg text-center font-semibold text-center">
          Client Management
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          {clientContractAddress}
        </p>
        <Button asChild className="mt-4">
          <Link href="/client">Change Client Contract</Link>
        </Button>
      </div>

      <SafeProvider safeAddress={clientContractOwner}>
        <>
          <ClientAllowanceWidget
            clientContractAddress={clientContractAddress}
          />
          <ContractOwnershipWidget
            contractAddress={clientContractAddress}
            ownableType="ownable2Step"
          />

          <SafeGuard>
            <SafePendingTransactionsList
              targetFilter={{
                abi: clientABI,
                address: clientContractAddress,
                formatTransactionTitle,
              }}
            />
          </SafeGuard>
        </>
      </SafeProvider>
    </div>
  );
}

function formatTransactionTitle(
  functionData: DecodeFunctionDataReturnType<typeof clientABI>
): string | null {
  switch (functionData.functionName) {
    case "acceptOwnership":
      return "Accept ownership of the contract";
    case "transferOwnership":
      return `Transfer ownership of the contract to ${functionData.args[0]}`;
    case "decreaseAllowance":
      return `Decrease Client ${
        functionData.args[0]
      } allowance by ${formatBytes(functionData.args[1])}`;
    default:
      return null;
  }
}
