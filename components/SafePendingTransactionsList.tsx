import useConfirmSafeTransaction from "@/hooks/useConfirmSafeTransaction";
import useExecuteSafeTransaction from "@/hooks/useExecuteSafeTransaction";
import useSafeContext from "@/hooks/useSafeContext";
import useSafeOwners from "@/hooks/useSafeOwners";
import useSafePendingTransactions from "@/hooks/useSafePendingTransactions";
import { SafeMultisigTransactionResponse } from "@safe-global/types-kit";
import {
  Abi,
  decodeFunctionData,
  Hex,
  isAddress,
  isAddressEqual,
  type Address,
} from "viem";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Target {
  address: Address;
  abi: Abi;
}

export interface SafePendingTransactionsListProps {
  targetFilter?: Target;
}

export function SafePendingTransactionsList({
  targetFilter,
}: SafePendingTransactionsListProps) {
  const account = useAccount();
  const { safeAddress } = useSafeContext();
  const {
    data: pendingTransactions = [],
    error,
    isLoading,
  } = useSafePendingTransactions();
  const { data: safeOwners = [] } = useSafeOwners(safeAddress);
  const ownerConnected =
    !!account.address && safeOwners.includes(account.address);
  const { mutate: confirmSafeTransaction } = useConfirmSafeTransaction();
  const { mutate: executeSafeTransaction } = useExecuteSafeTransaction();
  // const visibleTransactions = pendingTransactions;
  const visibleTransactions = targetFilter
    ? pendingTransactions.filter((pendingTx) => {
        return (
          isAddress(pendingTx.to) &&
          isAddressEqual(pendingTx.to, targetFilter.address)
        );
      })
    : pendingTransactions;

  return (
    <Card>
      <CardHeader className="flex-col items-start">
        <CardTitle className="text-lg text-primary font-semibold">
          Pending Transactions
        </CardTitle>
        <CardDescription>Safe Address: {safeAddress ?? "-"}</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading && <p>Loading pending transactions...</p>}
        {error && (
          <p>Error occured loading transactions list {error.message}</p>
        )}

        {!isLoading && !error && (
          <>
            {visibleTransactions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No pending transactions
              </p>
            )}

            {visibleTransactions.length > 0 && (
              <ol>
                {pendingTransactions.map((pendingTx) => {
                  const confirmationsCount =
                    pendingTx.confirmations?.length ?? 0;
                  const threshold = pendingTx.confirmationsRequired;
                  const canConfirm =
                    ownerConnected && pendingTx.proposer !== account.address;
                  const canExecute = confirmationsCount >= threshold;

                  return (
                    <li key={pendingTx.safeTxHash}>
                      <p>
                        {getTransactionTitle(pendingTx, targetFilter)} (
                        {confirmationsCount}/{threshold})
                      </p>

                      {canConfirm && (
                        <Button
                          onClick={() =>
                            confirmSafeTransaction(
                              {
                                safeTxHash: pendingTx.safeTxHash,
                              },
                              {
                                onError: console.warn,
                                onSuccess: () =>
                                  console.log("TRANSACTION CONFIRMED"),
                              }
                            )
                          }
                        >
                          Confirm
                        </Button>
                      )}

                      {canExecute && (
                        <Button
                          onClick={() =>
                            executeSafeTransaction(
                              {
                                transaction: pendingTx,
                              },
                              {
                                onError: console.warn,
                                onSuccess: () =>
                                  console.log("TRANSACTION EXECUTED"),
                              }
                            )
                          }
                        >
                          Execute
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function getTransactionTitle(
  tx: SafeMultisigTransactionResponse,
  target: Target | undefined
): string {
  if (!tx.data || !target) {
    return tx.safeTxHash;
  }

  const functionData = decodeFunctionData({
    abi: target.abi,
    data: tx.data as Hex,
  });

  const argumentsString =
    functionData.args?.map((arg) => `"${String(arg)}"`).join(", ") ?? "";

  return `${functionData.functionName}(${argumentsString})`;
}

export default SafePendingTransactionsList;
