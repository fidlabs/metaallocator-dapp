import { cn } from "@/lib/utils";
import { TransactionBase } from "@safe-global/types-kit";
import FallbackConnectWalletButton from "./FallbackConnectWalletButton";
import LoaderButton from "./LoaderButton";
import RegularTransactionButton from "./RegularTransactionButton";
import SafeGuard from "./SafeGuard";
import SafeTransactionButton from "./SafeTransactionButton";
import { ButtonProps } from "./ui/button";

export type TransactionType = "safe" | "regular";

export interface TransactionButtonProps extends Omit<ButtonProps, "onError"> {
  transaction: TransactionBase | null | undefined;
  onError?(error: Error): void;
  onSuccess?(ethereumTransactionHash: string | void): void;
}

export function TransactionButton({
  children,
  transaction,
  onError,
  onSuccess,
  ...rest
}: TransactionButtonProps) {
  return (
    <SafeGuard
      notConnectedFallback={() => <FallbackConnectWalletButton {...rest} />}
      notDeployedFallback={() => (
        <RegularTransactionButton
          {...rest}
          transaction={transaction}
          onError={onError}
          onSuccess={onSuccess}
        >
          {children}
        </RegularTransactionButton>
      )}
      notInitializedFallback={() => (
        <LoaderButton
          {...rest}
          loading
          className={cn(rest.className, "min-w-[120px]")}
        >
          {children}
        </LoaderButton>
      )}
    >
      <SafeTransactionButton
        {...rest}
        transaction={transaction}
        onError={onError}
        onSuccess={onSuccess}
      >
        {children}
      </SafeTransactionButton>
    </SafeGuard>
  );
}

export default TransactionButton;
