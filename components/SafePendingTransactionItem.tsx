import { cn } from "@/lib/utils";
import type { SafeMultisigTransactionResponse } from "@safe-global/types-kit";
import { HTMLAttributes, ReactNode } from "react";
import {
  decodeFunctionData,
  DecodeFunctionDataReturnType,
  type Abi,
  type Address,
  type Hex,
} from "viem";
import ConfirmSafeTransactionButton from "./ConfirmSafeTransactionButton";
import TransactionConfirmationsBadge from "./TransactionConfirmationsBadge";

interface Target<abi extends Abi> {
  address: Address;
  abi: abi;
  formatTransactionTitle?(
    functionData: DecodeFunctionDataReturnType<abi>
  ): ReactNode | null;
}

type BaseProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export interface SafePendingTransactionItemProps<abi extends Abi>
  extends BaseProps {
  index: number;
  target?: Target<abi>;
  transaction: SafeMultisigTransactionResponse;
}

export function SafePendingTransactionItem<const abi extends Abi>({
  className,
  index,
  target,
  transaction,
  ...rest
}: SafePendingTransactionItemProps<abi>) {
  const confirmationsCount = transaction.confirmations?.length ?? 0;

  return (
    <div
      {...rest}
      className={cn(
        "flex justify-between items-center gap-3 px-6 py-3 odd:bg-gray-100",
        className
      )}
    >
      <span className="block w-6 h-6 leading-6 bg-dodger-blue text-sm text-center text-white rounded-full">
        {index}
      </span>

      <div className="flex-1">
        <p className="mb-1">{getTransactionTitle(transaction, target)}</p>
        <TransactionConfirmationsBadge
          confirmationsCount={confirmationsCount}
          confirmationsRequired={transaction.confirmationsRequired}
        />
      </div>

      <ConfirmSafeTransactionButton pendingSafeTransaction={transaction}>
        Confirm
      </ConfirmSafeTransactionButton>
    </div>
  );
}

export default SafePendingTransactionItem;

function getTransactionTitle<const abi extends Abi>(
  tx: SafeMultisigTransactionResponse,
  target: Target<abi> | undefined
): ReactNode {
  if (!tx.data || !target) {
    return tx.safeTxHash;
  }

  const functionData = decodeFunctionData({
    abi: target.abi,
    data: tx.data as Hex,
  });

  const argumentsString = Array.isArray(functionData.args)
    ? functionData.args.map((arg) => `"${String(arg)}"`).join(", ")
    : "";
  const defaultTransactionTitle = `${functionData.functionName}(${argumentsString})`;

  const customTransactionTitle = target.formatTransactionTitle?.(functionData);
  return customTransactionTitle || defaultTransactionTitle;
}
