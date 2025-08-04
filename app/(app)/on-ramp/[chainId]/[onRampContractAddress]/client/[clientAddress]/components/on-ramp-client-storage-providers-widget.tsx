"use client";

import onRampABI from "@/abi/OnRamp";
import TransactionButton from "@/components/TransactionButton";
import { Button } from "@/components/ui/button";
import { useClientAllowedStorageProviders } from "@/hooks/use-client-allowed-storage-providers";
import { useOnRampAccessControlForAccount } from "@/hooks/use-on-ramp-access-control-for-account";
import { useOnRampClientContractAddress } from "@/hooks/use-on-ramp-client-contract-address";
import { arrayUnique, cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  Input,
} from "@fidlabs/common-react-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionBase } from "@safe-global/types-kit";
import { Loader2Icon, XIcon } from "lucide-react";
import { HTMLAttributes, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";
import { filecoinCalibration } from "viem/chains";
import { useAccount, useChainId } from "wagmi";
import { z } from "zod";

type StorageProviderId = `${"f0" | "t0" | ""}${number}` | "";

interface Change {
  type: "add" | "remove";
  ids: bigint[];
}

export interface OnRampClientStorageProvidersWidgetProps {
  onRampContractAddress: Address;
  clientAddress: Address;
}

const storageProviderIdRegex = /^(?:f0|t0){0,1}[0-9]+$/;

const formSchema = z.object({
  storageProviderId: z
    .string()
    .refine<StorageProviderId>((value): value is StorageProviderId => {
      return storageProviderIdRegex.test(value);
    }),
});

function storageProviderIdToBigint(
  storageProviderId: StorageProviderId
): bigint {
  const textValue =
    storageProviderId.startsWith("f0") || storageProviderId.startsWith("t0")
      ? storageProviderId.slice(2)
      : storageProviderId;
  return BigInt(textValue);
}

export function OnRampClientStorageProvidersWidget({
  onRampContractAddress,
  clientAddress,
}: OnRampClientStorageProvidersWidgetProps) {
  const [change, setChange] = useState<Change | null>(null);
  const { address: accountAddress } = useAccount();
  const { data: accessControl } = useOnRampAccessControlForAccount({
    onRampContractAddress,
    accountAddress,
  });

  const currentAccountHasAccess =
    !!accessControl?.manager || !!accessControl?.allocator;

  const { data: clientContractAddress } = useOnRampClientContractAddress({
    onRampContractAddress,
  });

  const { data: allowedSPs } = useClientAllowedStorageProviders({
    clientContractAddress,
    clientAddress,
    refetchOnEvents: true,
  });

  const transaction = useMemo<TransactionBase | null>(() => {
    if (change === null) {
      return null;
    }

    return {
      to: onRampContractAddress,
      data: encodeFunctionData({
        abi: onRampABI,
        functionName:
          change.type === "add"
            ? "addAllowedSPsForClient"
            : "removeAllowedSPsForClient",
        args: [clientAddress, change.ids],
      }),
      value: "0",
    };
  }, [change, clientAddress, onRampContractAddress]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storageProviderId: "" as StorageProviderId,
    },
  });

  const { reset: resetForm } = form;

  const handleFormSubmit = useCallback(
    ({ storageProviderId }: z.infer<typeof formSchema>) => {
      const bigIntValue = storageProviderIdToBigint(storageProviderId);

      if (storageProviderId === "" || allowedSPs?.includes(bigIntValue)) {
        return;
      }

      setChange((currentChange) => {
        if (currentChange !== null && currentChange.type !== "add") {
          return currentChange;
        }

        return {
          type: "add",
          ids: arrayUnique([...(currentChange?.ids ?? []), bigIntValue]),
        };
      });

      resetForm();
    },
    [allowedSPs, resetForm]
  );

  const selectStorageProviderForRemoval = useCallback(
    (storageProviderId: bigint) => {
      if (!currentAccountHasAccess) {
        return;
      }

      setChange((currentChange) => {
        if (currentChange !== null && currentChange?.type !== "remove") {
          return currentChange;
        }

        const currentIds = currentChange?.ids ?? [];
        const foundIndex = currentIds.findIndex(
          (candidateId) => candidateId === storageProviderId
        );
        const nextIds =
          foundIndex === -1
            ? [...currentIds, storageProviderId]
            : currentIds.toSpliced(foundIndex, 1);

        return nextIds.length === 0
          ? null
          : {
              type: "remove",
              ids: nextIds,
            };
      });
    },
    [currentAccountHasAccess]
  );

  const handleRemoveAddedStorageProvider = useCallback(
    (storageProviderId: bigint) => {
      setChange((currentChange) => {
        if (!currentChange || currentChange.type !== "add") {
          return currentChange;
        }

        const nextIds = currentChange.ids.filter(
          (candidate) => candidate !== storageProviderId
        );

        return nextIds.length === 0
          ? null
          : ({ type: "add", ids: nextIds } satisfies Change);
      });
    },
    []
  );

  const resetChanges = useCallback(() => {
    setChange(null);
  }, []);

  const handleTransactionSuccess = useCallback(
    (txHash?: string) => {
      toast.success(
        txHash
          ? "Client allowed SPs updated"
          : "Client allowed SPs update waiting for Safe confirmation"
      );
      resetForm();
      resetChanges();
    },
    [resetChanges, resetForm]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Allowed SPs</CardTitle>
        <CardDescription>
          Select IDs to remove or enter new IDs to be added. You can&apos;t
          remove and add IDs at the same time.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {typeof allowedSPs === "undefined" && (
          <Loader2Icon className="animate-spin text-dodger-blue h-8 w-8 justify-self-center" />
        )}

        {!!allowedSPs && (
          <div className="flex flex-wrap items-center gap-2">
            {allowedSPs.map((storageProviderId, index) => (
              <StorageProviderChip
                key={`sp_${index}`}
                storageProviderId={storageProviderId}
                className={cn(
                  change?.type === "add" && "cursor-not-allowed",
                  change?.type === "remove" &&
                    change.ids.includes(storageProviderId) &&
                    "border-red-500 bg-red-500/20"
                )}
                onSelectStorageProviderId={selectStorageProviderForRemoval}
              />
            ))}

            {change?.type === "add" &&
              change.ids.map((storageProviderId, index) => (
                <StorageProviderChip
                  key={`new_sp_${index}`}
                  storageProviderId={storageProviderId}
                  className="border-green-500 bg-green-500/20"
                  onSelectStorageProviderId={handleRemoveAddedStorageProvider}
                />
              ))}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                <FormField
                  control={form.control}
                  name="storageProviderId"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className={cn(
                        "text-sm w-[200px] py-1 h-[34px]",
                        change?.type === "remove" && "hidden"
                      )}
                      placeholder="Enter IDs to be added..."
                      disabled={
                        (!!change && change.type !== "add") ||
                        !currentAccountHasAccess
                      }
                    />
                  )}
                />
              </form>
            </Form>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {change !== null && (
          <p className="text-sm mr-4">
            {change.type === "add" ? "Adding" : "Removing"} {change.ids.length}{" "}
            allowed SP{change.ids.length !== 1 && "s"}
          </p>
        )}

        <Button
          disabled={change === null}
          variant="secondary"
          onClick={resetChanges}
        >
          Reset
        </Button>

        <TransactionButton
          disabled={!currentAccountHasAccess}
          transaction={transaction}
          onSuccess={handleTransactionSuccess}
        >
          Save
        </TransactionButton>
      </CardFooter>
    </Card>
  );
}

interface StorageProviderChipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  storageProviderId: bigint;
  onSelectStorageProviderId?(storageProviderId: bigint): void;
}

function StorageProviderChip({
  className,
  storageProviderId,
  onClick,
  onSelectStorageProviderId,
  ...rest
}: StorageProviderChipProps) {
  const chainId = useChainId();
  const prefix = chainId === filecoinCalibration.id ? "t0" : "f0";
  const chipText = prefix + storageProviderId.toString();

  const handleClick = useCallback<NonNullable<typeof onClick>>(
    (event) => {
      onClick?.(event);
      onSelectStorageProviderId?.(storageProviderId);
    },
    [onClick, onSelectStorageProviderId, storageProviderId]
  );

  return (
    <div
      {...rest}
      className={cn(
        "flex items-center border rounded-xl py-1.5 cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <span className="text-sm ml-3">{chipText}</span>
      <XIcon className="w-4 h-4 mx-2" />
    </div>
  );
}
