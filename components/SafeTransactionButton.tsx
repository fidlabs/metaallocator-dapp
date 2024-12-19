import useSafeContext from "@/hooks/useSafeContext";
import useSafeOwners from "@/hooks/useSafeOwners";
import useSendSafeTransaction from "@/hooks/useSendSafeTransaction";
import { TransactionBase } from "@safe-global/types-kit";
import { MouseEventHandler, useCallback } from "react";
import { useAccount } from "wagmi";
import LoaderButton, { LoaderButtonProps } from "./LoaderButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export interface SafeTransactionButtonProps
  extends Omit<LoaderButtonProps, "onError"> {
  transaction: TransactionBase | null | undefined;
  onError?(error: Error): void;
  onSuccess?(): void;
}

export function SafeTransactionButton({
  children,
  disabled,
  loading,
  transaction,
  onClick,
  onError,
  onSuccess,
  ...rest
}: SafeTransactionButtonProps) {
  const { address: accountAddress } = useAccount();
  const { safeAddress } = useSafeContext();
  const { data: safeOwners = [], status: ownersQueryStatus } =
    useSafeOwners(safeAddress);
  const { mutate: sendTransaction, status: sendTransactionStatus } =
    useSendSafeTransaction({
      onSuccess,
      onError,
    });
  const showLoader =
    ownersQueryStatus === "pending" || sendTransactionStatus === "pending";
  const isOwner = !!accountAddress && safeOwners.includes(accountAddress);

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

  const buttonEl = (
    <LoaderButton
      {...rest}
      disabled={disabled || !transaction || !isOwner}
      loading={loading || showLoader}
      onClick={handleClick}
    >
      {children}
    </LoaderButton>
  );

  return !isOwner ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{buttonEl}</span>
        </TooltipTrigger>

        <TooltipContent>
          <p>Only Safe owners can initialize transactions</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    buttonEl
  );
}

export default SafeTransactionButton;
