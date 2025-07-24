import onRampABI from "@/abi/OnRamp";
import BinaryBytesField from "@/components/BinaryBytesField";
import TransactionButton from "@/components/TransactionButton";
import { useOnRampAccessControlForAccount } from "@/hooks/use-on-ramp-access-control-for-account";
import { useOnRampClientInfo } from "@/hooks/use-on-ramp-client-info";
import { Skeleton } from "@fidlabs/common-react-ui";
import { TransactionBase } from "@safe-global/types-kit";
import { LockKeyholeIcon, LockKeyholeOpenIcon } from "lucide-react";
import { createElement, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";
import { useAccount } from "wagmi";

export interface OnRampClientLockWidgetProps {
  onRampContractAddress: Address;
  clientAddress: Address;
}

export function OnRampClientLockWidget({
  onRampContractAddress,
  clientAddress,
}: OnRampClientLockWidgetProps) {
  const [amount, setAmount] = useState<bigint | null>(null);
  const { address: accountAddress } = useAccount();
  const { data: accessControl } = useOnRampAccessControlForAccount({
    onRampContractAddress,
    accountAddress,
  });

  const currentAccountHasAccess = !!accessControl?.manager;

  const { data: clientInfo, isFetching } = useOnRampClientInfo({
    onRampContractAddress,
    clientAddress,
    refetchOnEvents: true,
  });

  const lockStatus = clientInfo?.locked;

  const transaction = useMemo<TransactionBase | null>(() => {
    if (typeof lockStatus !== "boolean") {
      return null;
    }

    return {
      to: onRampContractAddress,
      value: "0",
      data: encodeFunctionData({
        abi: onRampABI,
        functionName: lockStatus ? "unlock" : "lock",
        args: lockStatus ? [clientAddress] : [clientAddress, amount ?? 0n],
      }),
    };
  }, [amount, clientAddress, lockStatus, onRampContractAddress]);

  const handleTransactionSuccess = useCallback((txHash?: string) => {
    toast.success(
      txHash
        ? "Client lock status changed"
        : "Client lock status change waiting for Safe confirmation"
    );

    setAmount(null);
  }, []);

  return (
    <div className="bg-white shadow-f-card rounded-xl p-6 flex justify-between items-center">
      {clientInfo && !isFetching ? (
        <p>
          Client is <strong>{!clientInfo.locked && "not "}locked</strong>.
        </p>
      ) : (
        <Skeleton className="h-6 w-[160px]" />
      )}

      <div className="flex-1 flex items-center gap-2 justify-end">
        {!!clientInfo && !clientInfo.locked && (
          <BinaryBytesField
            className="flex-1 max-w-[460px]"
            placeholder="(Optional) Amount of allowance to be removed"
            allowedUnits={["GiB", "TiB", "PiB"]}
            initialUnit="PiB"
            value={amount}
            onValueChange={setAmount}
          />
        )}

        <TransactionButton
          transaction={transaction}
          disabled={!clientInfo || !currentAccountHasAccess}
          onSuccess={handleTransactionSuccess}
        >
          {createElement(
            clientInfo?.locked ? LockKeyholeOpenIcon : LockKeyholeIcon,
            { className: "h-4 w-4" }
          )}
          {clientInfo?.locked ? "Unlock" : "Lock"}
        </TransactionButton>
      </div>
    </div>
  );
}
