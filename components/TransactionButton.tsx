import { TransactionBase } from "@safe-global/types-kit";
import SafeGuard from "./SafeGuard";
import SafeTransactionButton from "./SafeTransactionButton";
import { ButtonProps } from "./ui/button";

export interface TransactionButtonProps extends ButtonProps {
  transaction: TransactionBase | null | undefined;
  onSuccess?(): void;
}

export function TransactionButton({
  transaction,
  ...rest
}: TransactionButtonProps) {
  return (
    <SafeGuard>
      <SafeTransactionButton {...rest} transaction={transaction} />
    </SafeGuard>
  );
}

export default TransactionButton;
