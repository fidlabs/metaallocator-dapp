import useConfirmSafeTransaction from "@/hooks/useConfirmSafeTransaction";
import useSafeContext from "@/hooks/useSafeContext";
import useSafeOwners from "@/hooks/useSafeOwners";
import type { SafeMultisigTransactionResponse } from "@safe-global/types-kit";
import { PropsWithChildren, useCallback } from "react";
import { type Address, isAddressEqual } from "viem";
import { useAccount } from "wagmi";
import FallbackConnectWalletButton from "./FallbackConnectWalletButton";
import LoaderButton, { type LoaderButtonProps } from "./LoaderButton";
import SafeGuard from "./SafeGuard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import useExecuteSafeTransaction from "@/hooks/useExecuteSafeTransaction";

type ClickHandler = NonNullable<LoaderButtonProps["onClick"]>;

export interface ConfirmSafeTransactionButtonProps extends LoaderButtonProps {
  pendingSafeTransaction: SafeMultisigTransactionResponse;
  onSuccess?(): void;
}

function ButtonTooltip({
  children,
  tooltipText,
}: PropsWithChildren<{ tooltipText: string }>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{children}</span>
        </TooltipTrigger>

        <TooltipContent>
          <p className="text-sm">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ConfirmSafeTransactionButtonInner({
  children,
  disabled,
  loading,
  pendingSafeTransaction,
  onClick,
  onSuccess,
  ...rest
}: ConfirmSafeTransactionButtonProps) {
  const { safeAddress } = useSafeContext();
  const { data: safeOwners = [] } = useSafeOwners(safeAddress);
  const { address: accountAddress } = useAccount();
  const { mutate: confirmSafeTransaction, status: confirmStatus } =
    useConfirmSafeTransaction({
      onSuccess,
    });
  const { mutate: executeSafeTransaction, status: executeStatus } =
    useExecuteSafeTransaction({
      onSuccess,
    });
  const isOwner = !!accountAddress && safeOwners.includes(accountAddress);
  const alreadyConfirmed =
    !!accountAddress &&
    pendingSafeTransaction.confirmations?.some((confirmation) =>
      isAddressEqual(confirmation.owner as Address, accountAddress)
    );
  const thresholdReached =
    (pendingSafeTransaction.confirmations?.length ?? 0) >=
    pendingSafeTransaction.confirmationsRequired;
  const shouldDisableButton =
    !isOwner || (!thresholdReached && alreadyConfirmed);
  const shouldShowLoader =
    confirmStatus === "pending" || executeStatus === "pending";
  const shouldExecute = thresholdReached && !pendingSafeTransaction.isExecuted;

  const handleClick = useCallback<ClickHandler>(
    (event) => {
      onClick?.(event);

      if (shouldExecute) {
        executeSafeTransaction({
          transaction: pendingSafeTransaction,
        });
      } else {
        confirmSafeTransaction({
          safeTxHash: pendingSafeTransaction.safeTxHash,
        });
      }
    },
    [
      confirmSafeTransaction,
      executeSafeTransaction,
      onClick,
      pendingSafeTransaction,
      shouldExecute,
    ]
  );

  const buttonElement = (
    <LoaderButton
      {...rest}
      disabled={disabled || shouldDisableButton}
      loading={loading || shouldShowLoader}
      onClick={handleClick}
    >
      {children}
    </LoaderButton>
  );

  if (!isOwner) {
    return (
      <ButtonTooltip tooltipText="Only Safe owners can confirm transactions">
        {buttonElement}
      </ButtonTooltip>
    );
  }

  if (!thresholdReached && alreadyConfirmed) {
    return (
      <ButtonTooltip tooltipText="You have already confirmed this transaction">
        {buttonElement}
      </ButtonTooltip>
    );
  }

  return buttonElement;
}

export function ConfirmSafeTransactionButton({
  children,
  ...rest
}: ConfirmSafeTransactionButtonProps) {
  return (
    <SafeGuard
      notConnectedFallback={<FallbackConnectWalletButton />}
      notInitializedFallback={
        <ConfirmSafeTransactionButtonInner {...rest} loading>
          {children}
        </ConfirmSafeTransactionButtonInner>
      }
    >
      <ConfirmSafeTransactionButtonInner {...rest}>
        {children}
      </ConfirmSafeTransactionButtonInner>
    </SafeGuard>
  );
}

export default ConfirmSafeTransactionButton;
