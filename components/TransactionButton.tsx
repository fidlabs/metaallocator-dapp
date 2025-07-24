import useSafeContext from "@/hooks/useSafeContext";
import { cn } from "@/lib/utils";
import { TransactionBase } from "@safe-global/types-kit";
import FallbackConnectWalletButton from "./FallbackConnectWalletButton";
import LoaderButton from "./LoaderButton";
import RegularTransactionButton from "./RegularTransactionButton";
import SafeTransactionButton from "./SafeTransactionButton";
import { ButtonProps } from "./ui/button";

export type TransactionType = "safe" | "regular";

export interface TransactionButtonProps extends Omit<ButtonProps, "onError"> {
  transaction: TransactionBase | null | undefined;
  onError?(error: Error): void;
  onSuccess?(ethereumTransactionHash: string | void): void;
  onTransactionStart?(): void;
}

export function TransactionButton({
  children,
  transaction,
  onError,
  onSuccess,
  onTransactionStart,
  ...rest
}: TransactionButtonProps) {
  const { connected, deployed, initialized } = useSafeContext();

  if (!initialized) {
    return (
      <LoaderButton
        {...rest}
        loading
        className={cn(rest.className, "min-w-[120px]")}
      >
        {children}
      </LoaderButton>
    );
  }

  if (!connected) {
    return <FallbackConnectWalletButton {...rest} />;
  }

  if (!deployed) {
    return (
      <RegularTransactionButton
        {...rest}
        transaction={transaction}
        onError={onError}
        onSuccess={onSuccess}
        onTransactionStart={onTransactionStart}
      >
        {children}
      </RegularTransactionButton>
    );
  }

  return (
    <SafeTransactionButton
      {...rest}
      transaction={transaction}
      onError={onError}
      onSuccess={onSuccess}
      onTransactionStart={onTransactionStart}
    >
      {children}
    </SafeTransactionButton>
  );
}

export default TransactionButton;
