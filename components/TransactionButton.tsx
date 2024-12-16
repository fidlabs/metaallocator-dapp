import { TransactionBase } from "@safe-global/types-kit";
import SafeGuard from "./SafeGuard";
import SafeTransactionButton from "./SafeTransactionButton";
import { Button, ButtonProps } from "./ui/button";
import FallbackConnectWalletButton from "./FallbackConnectWalletButton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TransactionButtonProps extends ButtonProps {
  transaction: TransactionBase | null | undefined;
  onSuccess?(): void;
}

export function TransactionButton({
  transaction,
  onSuccess,
  ...rest
}: TransactionButtonProps) {
  return (
    <SafeGuard
      notConnectedFallback={() => <FallbackConnectWalletButton {...rest} />}
      notInitializedFallback={() => (
        <Button
          {...rest}
          disabled
          className={cn(rest.className, "min-w-[120px]")}
        >
          <Loader2 className="animate-spin" />
        </Button>
      )}
    >
      <SafeTransactionButton
        {...rest}
        transaction={transaction}
        onSuccess={onSuccess}
      />
    </SafeGuard>
  );
}

export default TransactionButton;
