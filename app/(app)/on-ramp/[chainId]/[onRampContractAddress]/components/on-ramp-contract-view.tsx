"use client";

import { ContractPauseWidget } from "@/components/contrat-pause-widget";
import { OnRampAccessWarning } from "@/components/on-ramp-access-warning";
import SafeProvider from "@/components/SafeProvider";
import { useOnRampAccessControlForAccount } from "@/hooks/use-on-ramp-access-control-for-account";
import { type Address } from "viem";
import { useAccount } from "wagmi";
import { OnRampPendingTransactionsList } from "../../../components/on-ramp-pending-transactions-list";
import { OnRampClientsAddressBook } from "./on-ramp-clients-address-book";
import { OnRampRateLimitWidget } from "./on-ramp-rate-limit-widget";

export interface OnRampContractViewProps {
  onRampContractAddress: Address;
}

export function OnRampContractView({
  onRampContractAddress,
}: OnRampContractViewProps) {
  const { address: accountAddress } = useAccount();
  const { data: onRampAccess } = useOnRampAccessControlForAccount({
    onRampContractAddress,
    accountAddress,
  });

  const hasManagerRole = !!onRampAccess && onRampAccess.manager !== null;
  const safeAddress =
    !!onRampAccess?.manager && onRampAccess.manager.isSafe
      ? onRampAccess.manager.address
      : undefined;

  return (
    <SafeProvider safeAddress={safeAddress}>
      <div className="grid gap-6 pb-12">
        <div className="flex flex-col items-center">
          <h2 className="text-center text-xl font-semibold">
            Manage On-Ramp Contract
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            {onRampContractAddress}
          </p>
        </div>

        <OnRampAccessWarning onRampContractAddress={onRampContractAddress} />

        <OnRampClientsAddressBook
          onRampContractAddress={onRampContractAddress}
        />

        <OnRampRateLimitWidget onRampContractAddress={onRampContractAddress} />

        <ContractPauseWidget
          contractAddress={onRampContractAddress}
          disabled={!hasManagerRole}
        />

        <OnRampPendingTransactionsList
          onRampContractAddress={onRampContractAddress}
        />
      </div>
    </SafeProvider>
  );
}
