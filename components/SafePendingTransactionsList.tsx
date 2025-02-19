import useSafeContext from "@/hooks/useSafeContext";
import useSafePendingTransactions from "@/hooks/useSafePendingTransactions";
import { type Abi, isAddress, isAddressEqual } from "viem";
import SafePendingTransactionItem, {
  SafePendingTransactionItemProps,
} from "./SafePendingTransactionItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export interface SafePendingTransactionsListProps<abi extends Abi> {
  targetFilter?: SafePendingTransactionItemProps<abi>["target"];
}

export function SafePendingTransactionsList<const abi extends Abi>({
  targetFilter,
}: SafePendingTransactionsListProps<abi>) {
  const { safeAddress } = useSafeContext();
  const {
    data: pendingTransactions = [],
    error,
    isLoading,
  } = useSafePendingTransactions();
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
              <div className="-mx-6">
                {visibleTransactions.map((pendingTx, index) => {
                  return (
                    <SafePendingTransactionItem<abi>
                      key={pendingTx.safeTxHash}
                      index={index + 1}
                      transaction={pendingTx}
                      target={targetFilter}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default SafePendingTransactionsList;
