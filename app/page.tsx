"use client";

import FactoryContractsWidget from "@/components/FactoryContractsWidget";
import FactoryOwnerCard from "@/components/FactoryOwnerCard";
import SafeGuard from "@/components/SafeGuard";
import SafePendingTransactionsList from "@/components/SafePendingTransactionsList";
import SafeProvider from "@/components/SafeProvider";
import useFactoryAddress from "@/hooks/useFactoryAddress";
import useFactoryOwner from "@/hooks/useFactoryOwner";

export default function HomePage() {
  const factoryAddress = useFactoryAddress();
  const { data: factoryOwner } = useFactoryOwner();

  return (
    <SafeProvider safeAddress={factoryOwner}>
      <div className="container mx-auto py-6 flex flex-col gap-6 pb-8">
        <div>
          <h1 className="text-lg text-center font-semibold">Factory</h1>
          <p className="text-center text-muted-foreground">
            Owner: {factoryOwner ?? "-"}
          </p>
        </div>
        <FactoryOwnerCard />
        <FactoryContractsWidget factoryAddress={factoryAddress} />
        <SafeGuard>
          <SafePendingTransactionsList />
        </SafeGuard>
      </div>
    </SafeProvider>
  );
}
