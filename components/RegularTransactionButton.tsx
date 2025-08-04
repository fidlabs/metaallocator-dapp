import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import LoaderButton, { type LoaderButtonProps } from "./LoaderButton";
import type { Address, Hex } from "viem";
import { useCallback, useEffect, useState } from "react";
import { TransactionBase } from "@safe-global/types-kit";

export interface RegularTransactionButtonProps
  extends Omit<LoaderButtonProps, "onError"> {
  transaction: TransactionBase | null | undefined;
  onError?(error: Error): void;
  onSuccess?(ethereumTransactionHash: string): void;
  onTransactionHash?(transactionHash: Hex): void;
  onTransactionStart?(): void;
}

type ClickHandler = NonNullable<LoaderButtonProps["onClick"]>;

export function RegularTransactionButton({
  children,
  disabled,
  loading,
  transaction,
  onClick,
  onError,
  onSuccess,
  onTransactionHash,
  onTransactionStart,
  ...rest
}: RegularTransactionButtonProps) {
  const [transactionHash, setTransactionHash] = useState<Hex>();

  const handleSendTransaction = useCallback(() => {
    setTransactionHash(undefined);
    onTransactionStart?.();
  }, [onTransactionStart]);

  const handleSendTransactionSuccess = useCallback(
    (nextTransactionHash: Hex) => {
      setTransactionHash(nextTransactionHash);
      onTransactionHash?.(nextTransactionHash);
    },
    [onTransactionHash]
  );

  const { sendTransaction, isPending } = useSendTransaction({
    mutation: {
      onMutate: handleSendTransaction,
      onSuccess: handleSendTransactionSuccess,
      onError,
    },
  });

  const { error, status: waitStatus } = useWaitForTransactionReceipt({
    hash: transactionHash,
    query: {
      enabled: typeof transactionHash !== "undefined",
    },
  });

  const shouldShowLoader =
    isPending || (!!transactionHash && waitStatus === "pending");

  useEffect(() => {
    if (error) {
      setTransactionHash(undefined);
      onError?.(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (!!transactionHash && waitStatus === "success") {
      onSuccess?.(transactionHash);
      setTransactionHash(undefined);
    }
  }, [onSuccess, transactionHash, waitStatus]);

  const handleClick = useCallback<ClickHandler>(
    (event) => {
      onClick?.(event);

      if (!transaction) {
        return;
      }

      sendTransaction({
        to: transaction.to as Address,
        data: transaction.data as Hex,
        value: BigInt(transaction.value),
      });
    },
    [onClick, sendTransaction, transaction]
  );

  return (
    <LoaderButton
      {...rest}
      disabled={disabled || !transaction}
      loading={loading || shouldShowLoader}
      onClick={handleClick}
    >
      {children}
    </LoaderButton>
  );
}

export default RegularTransactionButton;
