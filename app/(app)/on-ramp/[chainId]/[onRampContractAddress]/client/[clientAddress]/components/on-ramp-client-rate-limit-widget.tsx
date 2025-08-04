import onRampABI from "@/abi/OnRamp";
import BinaryBytesField from "@/components/BinaryBytesField";
import TransactionButton from "@/components/TransactionButton";
import { Card } from "@/components/ui/card";
import { useOnRampAccessControlForAccount } from "@/hooks/use-on-ramp-access-control-for-account";
import { useOnRampClientInfo } from "@/hooks/use-on-ramp-client-info";
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

export interface OnRampRateClientRateLimitWidgetProps {
  onRampContractAddress: Address;
  clientAddress: Address;
}

const formSchema = z.object({
  windowSizeInBlocks: z
    .bigint({
      coerce: true,
      invalid_type_error: "Invalid value",
    })
    .min(1n),
  limitPerWindow: z
    .bigint({
      coerce: true,
      invalid_type_error: "Invalid value",
    })
    .min(0n),
});

export function OnRampClientRateLimitWidget({
  onRampContractAddress,
  clientAddress,
}: OnRampRateClientRateLimitWidgetProps) {
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const { address: accountAddress } = useAccount();
  const { data: accessControl } = useOnRampAccessControlForAccount({
    onRampContractAddress,
    accountAddress,
  });

  const currentAccountHasAccess = !!accessControl?.manager;

  const { data: clientInfo, isFetching } = useOnRampClientInfo({
    onRampContractAddress,
    clientAddress,
    refetchOnEvents: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { reset: resetForm } = form;

  const [windowSizeInBlocks, limitPerWindow] = useWatch({
    control: form.control,
    name: ["windowSizeInBlocks", "limitPerWindow"],
  });

  const transaction = useMemo<TransactionBase | null>(() => {
    const { success, data } = formSchema.safeParse({
      windowSizeInBlocks,
      limitPerWindow,
    });

    if (!success) {
      return null;
    }

    return {
      to: onRampContractAddress,
      value: "0",
      data: encodeFunctionData({
        abi: onRampABI,
        functionName: "setClientRateLimitParameters",
        args: [clientAddress, data.windowSizeInBlocks, data.limitPerWindow],
      }),
    };
  }, [
    windowSizeInBlocks,
    limitPerWindow,
    onRampContractAddress,
    clientAddress,
  ]);

  const handleResetButtonClick = useCallback(() => {
    if (!clientInfo) {
      return;
    }

    resetForm({
      windowSizeInBlocks: clientInfo.windowSizeInBlock,
      limitPerWindow: clientInfo.limitPerWindow,
    });
  }, [clientInfo, resetForm]);

  const handleTransactionStart = useCallback(() => {
    setTransactionInProgress(true);
  }, []);

  const handleTransactionSuccess = useCallback((txHash?: string) => {
    setTransactionInProgress(false);

    toast.success(
      txHash
        ? "Client rate limits updated"
        : "Client rate limits update waiting for Safe confirmation"
    );
  }, []);

  const handleTransactionError = useCallback(() => {
    setTransactionInProgress(false);

    toast.error("An error occured while updating client rate limits");
  }, []);

  useEffect(() => {
    if (clientInfo) {
      form.setValue("windowSizeInBlocks", clientInfo.windowSizeInBlock);
      form.setValue("limitPerWindow", clientInfo.limitPerWindow);
    }
  }, [clientInfo, form]);

  return (
    <Form {...form}>
      <Card>
        <CardHeader>
          <CardTitle>Manage Client Rate Limits</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <FormField
            control={form.control}
            name="windowSizeInBlocks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client window size in blocks</FormLabel>
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
            name="limitPerWindow"
            render={({ field: { onChange, ...restOfFieldProps } }) => (
              <FormItem>
                <FormLabel>Client limit per window</FormLabel>
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
