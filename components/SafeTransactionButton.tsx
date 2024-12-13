import useSendSafeTransaction from "@/hooks/useSendSafeTransaction";
import { TransactionBase } from "@safe-global/types-kit";
import { Loader2 } from "lucide-react";
import { MouseEventHandler, useCallback } from "react";
import { Button, ButtonProps } from "./ui/button";

export interface SafeTransactionButtonProps extends ButtonProps {
  transaction: TransactionBase | null | undefined;
  onSuccess?(): void;
}

export function SafeTransactionButton({
  children,
  disabled,
  transaction,
  onClick,
  onSuccess,
  ...rest
}: SafeTransactionButtonProps) {
  const {
    mutate: sendTransaction,
    isPending,
    isError,
    isSuccess,
  } = useSendSafeTransaction({
    onSuccess,
  });
  const loading = isPending && !isError && !isSuccess;

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      onClick?.(event);

      if (transaction) {
        sendTransaction({
          transactions: [transaction],
        });
      }
    },
    [onClick, sendTransaction, transaction]
  );

  return (
    <Button
      {...rest}
      disabled={disabled || !transaction || loading}
      onClick={handleClick}
    >
      {children}
      {loading && <Loader2 className="animate-spin" />}
    </Button>
  );
}

export default SafeTransactionButton;
