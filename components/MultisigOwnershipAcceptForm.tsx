import ownable2StepABI from "@/abi/Ownable2Step";
import useSafePendingTransactions from "@/hooks/useSafePendingTransactions";
import type { TransactionBase } from "@safe-global/types-kit";
import {
  type Address,
  decodeFunctionData,
  type Hex,
  isAddress,
  isAddressEqual,
} from "viem";
import ConfirmSafeTransactionButton from "./ConfirmSafeTransactionButton";
import SafeTransactionButton from "./SafeTransactionButton";
import TransactionConfirmationsBadge from "./TransactionConfirmationsBadge";

export interface MultisigOwnershipAcceptFormProps {
  acceptOwnershipTransaction: TransactionBase;
  onOwnershipAccepted?(): void;
}

export function MultisigOwnershipAcceptForm({
  acceptOwnershipTransaction,
  onOwnershipAccepted,
}: MultisigOwnershipAcceptFormProps) {
  const {
    data: pendingTransactions = [],
    isLoading: pendingTransactionsLoading,
  } = useSafePendingTransactions();

  const pendingAcceptanceTransaction = pendingTransactions.find((pendingTx) => {
    if (
      !pendingTx.data ||
      !isAddress(pendingTx.to) ||
      !isAddressEqual(pendingTx.to, acceptOwnershipTransaction.to as Address)
    ) {
      return false;
    }

    try {
      const functionData = decodeFunctionData({
        abi: ownable2StepABI,
        data: pendingTx.data as Hex,
      });

      return functionData.functionName === "acceptOwnership";
    } catch {
      return false;
    }
  });

  return (
    <div className="flex items-center gap-2">
      {!pendingAcceptanceTransaction && (
        <SafeTransactionButton
          disabled={pendingTransactionsLoading}
          loading={pendingTransactionsLoading}
          transaction={acceptOwnershipTransaction}
        >
          Accept Ownership
        </SafeTransactionButton>
      )}

      {!!pendingAcceptanceTransaction && (
        <>
          <TransactionConfirmationsBadge
            confirmationsCount={
              pendingAcceptanceTransaction.confirmations?.length ?? 0
            }
            confirmationsRequired={
              pendingAcceptanceTransaction.confirmationsRequired
            }
          />

          <ConfirmSafeTransactionButton
            pendingSafeTransaction={pendingAcceptanceTransaction}
            onSuccess={onOwnershipAccepted}
          >
            Accept Ownership
          </ConfirmSafeTransactionButton>
        </>
      )}
    </div>
  );
}

export default MultisigOwnershipAcceptForm;
