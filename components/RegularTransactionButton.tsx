import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import LoaderButton, { type LoaderButtonProps } from "./LoaderButton";
import type { Address, Hex } from "viem";
import { useCallback, useEffect, useState } from "react";
import { TransactionBase } from "@safe-global/types-kit";

export interface RegularTransactionButtonProps
  extends Omit<LoaderButtonProps, "onError"> {
  transaction: TransactionBase | null | undefined;
  onError?(error: Error): void;
  onSuccess?(): void;
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
  ...rest
}: RegularTransactionButtonProps) {
  const [transactionHash, setTransactionHash] = useState<Hex>();
  const { sendTransaction, status: sendStatus } = useSendTransaction({
    mutation: {
      onMutate() {
        setTransactionHash(undefined);
      },
      onSuccess: setTransactionHash,
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
    sendStatus === "pending" || (!!transactionHash && waitStatus === "pending");

  useEffect(() => {
    if (error) {
      setTransactionHash(undefined);
      onError?.(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (waitStatus === "success") {
      setTransactionHash(undefined);
      onSuccess?.();
    }
  }, [onSuccess, waitStatus]);

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
