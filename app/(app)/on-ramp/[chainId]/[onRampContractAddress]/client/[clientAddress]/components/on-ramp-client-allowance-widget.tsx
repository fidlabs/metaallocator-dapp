"use client";

import onRampABI from "@/abi/OnRamp";
import BinaryBytesField from "@/components/BinaryBytesField";
import TransactionButton from "@/components/TransactionButton";
import { useClientAllowance } from "@/hooks/use-client-allowance";
import { useOnRampAccessControlForAccount } from "@/hooks/use-on-ramp-access-control-for-account";
import { useOnRampClientContractAddress } from "@/hooks/use-on-ramp-client-contract-address";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fidlabs/common-react-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TransactionBase } from "@safe-global/types-kit";
import { filesize } from "filesize";
import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";
import { useAccount } from "wagmi";
import { z } from "zod";

export interface OnRampClientAllowanceWidgetProps {
  onRampContractAddress: Address;
  clientAddress: Address;
}

const formSchema = z.object({
  mode: z.string(),
  amount: z.bigint().min(1n),
});

export function OnRampClientAllowanceWidget({
  onRampContractAddress,
  clientAddress,
}: OnRampClientAllowanceWidgetProps) {
  const [transactionInProgress, setTransactionInProgress] = useState(false);
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

  const { data: clientAllowance } = useClientAllowance({
    clientContractAddress,
    clientAddress,
    refetchOnEvents: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: "increase",
      amount: 0n,
    },
  });

  const { reset: resetForm } = form;

  const [mode, amount] = useWatch({
    control: form.control,
    name: ["mode", "amount"],
  });

  const transaction = useMemo(() => {
    if (!amount) {
      return null;
    }

    return {
      to: onRampContractAddress,
      data: encodeFunctionData({
        abi: onRampABI,
        functionName:
          mode === "increase" ? "increaseAllowance" : "decreaseAllowance",
        args: [clientAddress, amount],
      }),
      value: "0",
    } satisfies TransactionBase;
  }, [amount, clientAddress, mode, onRampContractAddress]);

  const handleTransactionStart = useCallback(() => {
    setTransactionInProgress(true);
  }, []);

  const handleTransactionError = useCallback(() => {
    setTransactionInProgress(false);

    toast.error("An error occured when updating client allowance");
  }, []);

  const handleTransactionSuccess = useCallback(
    (txHash?: string) => {
      setTransactionInProgress(false);
      resetForm();

      toast.success(
        txHash
          ? "Allowance changed"
          : "Allowance change scheduled for Safe confirmation"
      );
    },
    [resetForm]
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-f-card flex">
      <div className="pr-4 lg:pr-8 border-r lg:flex-1">
        <h5 className="text-sm text-muted-foreground">Current Allowance</h5>
        <p className="font-semibold text-2xl mt-3">
          {typeof clientAllowance !== "undefined" &&
            filesize(clientAllowance, { standard: "iec" })}
        </p>
      </div>

      <div className="pl-4 lg:pl-8 flex-1 lg:flex-[2]">
        <h5 className="text-sm text-muted-foreground">Manage Allowance</h5>
        <Form {...form}>
          <div className="mt-2 flex gap-2 justify-items-stretch">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select
                    disabled={transactionInProgress}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="increase">Increase by</SelectItem>
                      <SelectItem value="decrease">Decrease by</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field: { onChange, ...restOfFieldProps } }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <BinaryBytesField
                      {...restOfFieldProps}
                      className="flex"
                      allowedUnits={["GiB", "TiB", "PiB"]}
                      initialUnit="PiB"
                      placeholder="Allowance amount"
                      disabled={transactionInProgress}
                      onValueChange={onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <TransactionButton
              transaction={transaction}
              disabled={!form.formState.isValid || !currentAccountHasAccess}
              onTransactionStart={handleTransactionStart}
              onError={handleTransactionError}
              onSuccess={handleTransactionSuccess}
            >
              {mode === "increase"
                ? "Increase Allowance"
                : "Decrease Allowance"}
            </TransactionButton>
          </div>
        </Form>
      </div>
    </div>
  );
}
