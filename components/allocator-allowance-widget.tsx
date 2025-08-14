import allocatorABI from "@/abi/Allocator";
import { useFilecoinPublicClient } from "@/hooks/use-filecoin-public-client";
import { useMetallocatorDatacapBreakdown } from "@/hooks/use-metaallocator-datacap-breakdown";
import { useSendSafeContextTransaction } from "@/hooks/use-send-safe-context-transaction";
import { isFilecoinAddress } from "@/types/common";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@fidlabs/common-react-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type Address, encodeFunctionData, Hex, isAddress } from "viem";
import { z } from "zod";
import { AllocationWarningAlert } from "./allocation-warning-alert";
import BinaryBytesField from "./BinaryBytesField";
import { SafeOwnerButton } from "./safe-owner-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export interface AllocatorAllowanceWidgetProps {
  allocatorContractAddress: Address;
}

const formSchema = z.object({
  allocatorAddress: z.string().refine<string>((value) => {
    return isAddress(value) || isFilecoinAddress(value);
  }, "Invalid allocator address"),
  allowance: z.string().superRefine((value, context) => {
    try {
      const bigintValue = BigInt(value);

      if (bigintValue <= 0) {
        context.addIssue({
          code: z.ZodIssueCode.too_small,
          message: "Amount must be grater than 0",
          minimum: 1n,
          inclusive: true,
          type: "bigint",
        });
      }
    } catch {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid value",
      });
    }
  }),
});

export function AllocatorAllowanceWidget({
  allocatorContractAddress,
}: AllocatorAllowanceWidgetProps) {
  const [mode, setMode] = useState("increase");
  const { data: datacapBreakdown, isLoading: datacapBreakdownLoading } =
    useMetallocatorDatacapBreakdown(allocatorContractAddress);

  const client = useFilecoinPublicClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      allocatorAddress: "",
      allowance: "",
    },
  });

  const { reset: resetForm } = form;

  const handleTransactionSuccess = useCallback(
    (maybeTxHash: Hex | undefined) => {
      resetForm();
      toast.success(
        maybeTxHash ? "Allowance was updated" : "Allowance scheduled for update"
      );
    },
    [resetForm]
  );

  const handleTransactionError = useCallback(() => {
    toast.error("Transaction failed");
  }, []);

  const { sendTransaction, transactionInProgress } =
    useSendSafeContextTransaction({
      onSuccess: handleTransactionSuccess,
      onError: handleTransactionError,
    });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const maybeEthereumAddress = await (async () => {
        try {
          return isFilecoinAddress(values.allocatorAddress)
            ? await client?.request({
                method: "Filecoin.FilecoinAddressToEthAddress",
                params: [values.allocatorAddress],
              })
            : values.allocatorAddress;
        } catch {
          toast.error("Could not convert Filecoin address to Ethereum address");
        }
      })();

      if (
        typeof maybeEthereumAddress !== "string" ||
        !isAddress(maybeEthereumAddress)
      ) {
        return null;
      }
      const transaction = {
        to: allocatorContractAddress,
        data: encodeFunctionData({
          abi: allocatorABI,
          functionName:
            mode === "increase" ? "addAllowance" : "decreaseAllowance",
          args: [maybeEthereumAddress, BigInt(values.allowance)],
        }),
        value: "0",
      } satisfies TransactionBase;

      sendTransaction(transaction);
    },
    [allocatorContractAddress, client, mode, sendTransaction]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle>Manage Allocator Allowance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList className="w-full">
                <TabsTrigger className="flex-1" value="increase">
                  Increase
                </TabsTrigger>
                <TabsTrigger className="flex-1" value="decrease">
                  Decrease
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <FormField
              control={form.control}
              name="allocatorAddress"
              render={({ field }) => (
                <FormItem>
                  <Input placeholder="Enter allocator address..." {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowance"
              render={({ field: { onChange, ...restOfFieldProps } }) => (
                <FormItem>
                  <BinaryBytesField
                    {...restOfFieldProps}
                    className="flex"
                    placeholder={`Enter allowance amount to be ${mode === "increase" ? "added" : "removed"}`}
                    allowedUnits={["GiB", "TiB", "PiB"]}
                    initialUnit="GiB"
                    onValueChange={(bi) => onChange(bi ? bi.toString() : "")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="allowance"
              render={({ field }) => {
                const allowanceToBeAdded =
                  field.value !== "" ? BigInt(field.value) : 0n;
                const showWarning =
                  mode === "increase" &&
                  allowanceToBeAdded > 0 &&
                  !!datacapBreakdown &&
                  datacapBreakdown.unallocatedDatacap - allowanceToBeAdded < 0n;

                if (!showWarning) {
                  return <></>;
                }

                return <AllocationWarningAlert />;
              }}
            />
          </CardContent>

          <CardFooter className="justify-end">
            <SafeOwnerButton
              disabled={form.formState.isSubmitted && !form.formState.isValid}
              loading={
                datacapBreakdownLoading ||
                form.formState.isSubmitting ||
                transactionInProgress
              }
              type="submit"
            >
              {mode === "increase" ? "Add" : "Remove"} Allowance
            </SafeOwnerButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default AllocatorAllowanceWidget;
