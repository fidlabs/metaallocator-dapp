"use client";

import { OnRampPendingTransactionsList } from "@/app/(app)/on-ramp/components/on-ramp-pending-transactions-list";
import { OnRampAccessWarning } from "@/components/on-ramp-access-warning";
import SafeProvider from "@/components/SafeProvider";
import { useOnRampAccessControlForAccount } from "@/hooks/use-on-ramp-access-control-for-account";
import { useMemo } from "react";
import { type Address } from "viem";
import { useAccount } from "wagmi";
import { OnRampClientAllowanceWidget } from "./on-ramp-client-allowance-widget";
import { OnRampClientDeviationWidget } from "./on-ramp-client-deviation-widget";
import { OnRampClientLockWidget } from "./on-ramp-client-lock-widget";
import { OnRampClientRateLimitWidget } from "./on-ramp-client-rate-limit-widget";
import { OnRampClientStorageProvidersWidget } from "./on-ramp-client-storage-providers-widget";

export interface OnRampClientViewProps {
  onRampContractAddress: Address;
  clientAddress: Address;
}

export function OnRampClientView({
  onRampContractAddress,
  clientAddress,
}: OnRampClientViewProps) {
  const { address: accountAddress } = useAccount();
  const { data: onRampAccess } = useOnRampAccessControlForAccount({
    onRampContractAddress,
    accountAddress,
  });

  const safeAddress = useMemo(() => {
    if (!onRampAccess) {
      return;
    }

    if (onRampAccess.manager?.isSafe) {
      return onRampAccess.manager.address;
    }

    return onRampAccess.allocator?.isSafe
      ? onRampAccess.allocator.address
      : undefined;
  }, [onRampAccess]);

  return (
    <SafeProvider safeAddress={safeAddress}>
      <div className="grid gap-6">
        <OnRampAccessWarning onRampContractAddress={onRampContractAddress} />

        <OnRampClientAllowanceWidget
          onRampContractAddress={onRampContractAddress}
          clientAddress={clientAddress}
        />

        <OnRampClientLockWidget
          onRampContractAddress={onRampContractAddress}
          clientAddress={clientAddress}
        />

        <OnRampClientRateLimitWidget
          onRampContractAddress={onRampContractAddress}
          clientAddress={clientAddress}
        />

        <OnRampClientStorageProvidersWidget
          onRampContractAddress={onRampContractAddress}
          clientAddress={clientAddress}
        />

        <OnRampClientDeviationWidget
          onRampContractAddress={onRampContractAddress}
          clientAddress={clientAddress}
        />

        <OnRampPendingTransactionsList
          onRampContractAddress={onRampContractAddress}
        />
      </div>
    </SafeProvider>
  );
}
