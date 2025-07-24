import onRampABI from "@/abi/OnRamp";
import BinaryBytesField from "@/components/BinaryBytesField";
import TransactionButton from "@/components/TransactionButton";
import { Card } from "@/components/ui/card";
import { useOnRampAccessControlForAccount } from "@/hooks/use-on-ramp-access-control-for-account";
import { useOnRampInitialRateLimits } from "@/hooks/use-on-ramp-initial-rate-limits";
import {
  Button,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@fidlabs/common-react-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";
import { useAccount } from "wagmi";
import { z } from "zod";

export interface OnRampRateLimitWidgetProps {
  onRampContractAddress: Address;
}

const formSchema = z.object({
  initialWindowSizeInBlocks: z
    .bigint({
      coerce: true,
      invalid_type_error: "Invalid value",
    })
    .min(1n),
  initialLimitPerWindow: z
    .bigint({
      coerce: true,
      invalid_type_error: "Invalid value",
    })
    .min(0n),
});

export function OnRampRateLimitWidget({
  onRampContractAddress,
}: OnRampRateLimitWidgetProps) {
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const { address: accountAddress } = useAccount();
  const { data: accessControl } = useOnRampAccessControlForAccount({
    onRampContractAddress,
    accountAddress,
  });

  const currentAccountHasAccess = !!accessControl?.manager;

  const {
    data: initialLimitData,
    isFetching,
    refetch,
  } = useOnRampInitialRateLimits({
    onRampContractAddress,
    refetchOnEvents: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { reset: resetForm } = form;

  const [initialWindowSizeInBlocks, initialLimitPerWindow] = useWatch({
    control: form.control,
    name: ["initialWindowSizeInBlocks", "initialLimitPerWindow"],
  });

  const transaction = useMemo<TransactionBase | null>(() => {
    const { success, data } = formSchema.safeParse({
      initialWindowSizeInBlocks,
      initialLimitPerWindow,
    });

    if (!success) {
      return null;
    }

    return {
      to: onRampContractAddress,
      value: "0",
      data: encodeFunctionData({
        abi: onRampABI,
        functionName: "setInitialRateLimitParameters",
        args: [data.initialWindowSizeInBlocks, data.initialLimitPerWindow],
      }),
    };
  }, [initialLimitPerWindow, initialWindowSizeInBlocks, onRampContractAddress]);

  const handleResetButtonClick = useCallback(() => {
    if (!initialLimitData) {
      return;
    }

    resetForm({
      initialWindowSizeInBlocks: initialLimitData[0],
      initialLimitPerWindow: initialLimitData[1],
    });
  }, [initialLimitData, resetForm]);

  const handleTransactionStart = useCallback(() => {
    setTransactionInProgress(true);
  }, []);

  const handleTransactionSuccess = useCallback(
    (txHash?: string) => {
      toast.success(
        txHash
          ? "On Ramp initial rate limits updated"
          : "On Ramp initial rate limits update waiting for Safe confirmation"
      );
      refetch();
      setTransactionInProgress(false);
    },
    [refetch]
  );

  const handleTransactionError = useCallback(() => {
    toast.error("An error occured while updating on ramp rate limits");
    setTransactionInProgress(false);
  }, []);

  useEffect(() => {
    if (initialLimitData) {
      form.setValue("initialWindowSizeInBlocks", initialLimitData[0]);
      form.setValue("initialLimitPerWindow", initialLimitData[1]);
    }
  }, [form, initialLimitData]);

  return (
    <Form {...form}>
      <Card>
        <CardHeader>
          <CardTitle>Manage initial rate limits</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <FormField
            control={form.control}
            name="initialWindowSizeInBlocks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial window size in blocks</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. 20160 blocks (1 week)"
                    {...field}
                    value={field.value?.toString() ?? ""}
                    disabled={isFetching || transactionInProgress}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="initialLimitPerWindow"
            render={({ field: { onChange, ...restOfFieldProps } }) => (
              <FormItem>
                <FormLabel>Initial limit per window</FormLabel>
                <FormControl>
                  <BinaryBytesField
                    {...restOfFieldProps}
                    className="flex"
                    allowedUnits={["GiB", "TiB", "PiB"]}
                    initialUnit="PiB"
                    placeholder="Eg. 1 PiB"
                    onValueChange={onChange}
                    disabled={isFetching || transactionInProgress}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button
            variant="secondary"
            disabled={isFetching || transactionInProgress}
            onClick={handleResetButtonClick}
          >
            Reset
          </Button>
          <TransactionButton
            transaction={transaction}
            disabled={
              !form.formState.isValid || isFetching || !currentAccountHasAccess
            }
            onTransactionStart={handleTransactionStart}
            onSuccess={handleTransactionSuccess}
            onError={handleTransactionError}
          >
            Update Rate Limits
          </TransactionButton>
        </CardFooter>
      </Card>
    </Form>
  );
}
