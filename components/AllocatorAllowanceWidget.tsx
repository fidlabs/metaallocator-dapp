import allocatorABI from "@/abi/Allocator";
import { useSendSafeContextTransaction } from "@/hooks/use-send-safe-context-transaction";
import { useFilecoinPublicClient } from "@/hooks/use-filecoin-public-client";
import { isFilecoinAddress } from "@/types/common";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@fidlabs/common-react-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionBase } from "@safe-global/types-kit";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type Address, encodeFunctionData, Hex, isAddress } from "viem";
import { z } from "zod";
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
          functionName: "addAllowance",
          args: [maybeEthereumAddress, BigInt(values.allowance)],
        }),
        value: "0",
      } satisfies TransactionBase;

      sendTransaction(transaction);
    },
    [allocatorContractAddress, client, sendTransaction]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle>Manage Allocator Allowance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
                    placeholder="Enter allowance amount to be added"
                    allowedUnits={["GiB", "TiB", "PiB"]}
                    initialUnit="GiB"
                    onValueChange={(bi) => onChange(bi ? bi.toString() : "")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="justify-end">
            <SafeOwnerButton
              disabled={form.formState.isSubmitted && !form.formState.isValid}
              loading={form.formState.isSubmitting || transactionInProgress}
              type="submit"
            >
              Add Allowance
            </SafeOwnerButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default AllocatorAllowanceWidget;
