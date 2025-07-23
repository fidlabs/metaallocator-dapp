import UUPSUpgradeableABI from "@/abi/UUPSUpgradeable";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@fidlabs/common-react-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TransactionBase } from "@safe-global/types-kit";
import { useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { type Address, encodeFunctionData, isAddress } from "viem";
import { z } from "zod";
import TransactionButton from "./TransactionButton";

export interface UUPSUpgradeableUpgradeWidgetProps {
  contractAddress: Address;
}

const formSchema = z.object({
  newImplementationAddress: z.string().refine((value): value is Address => {
    return isAddress(value);
  }, "Invalid EVM Address"),
});

export function UUPSUpgradeableUpgradeWidget({
  contractAddress,
}: UUPSUpgradeableUpgradeWidgetProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newImplementationAddress: "" as Address,
    },
  });

  const { reset: resetForm } = form;

  const newImplementationAddress = useWatch({
    control: form.control,
    name: "newImplementationAddress",
  });

  const transaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(newImplementationAddress)) {
      return null;
    }

    return {
      to: contractAddress,
      data: encodeFunctionData({
        abi: UUPSUpgradeableABI,
        functionName: "upgradeToAndCall",
        args: [newImplementationAddress, "0x"],
      }),
      value: "0",
    };
  }, [contractAddress, newImplementationAddress]);

  const handleTransactionSuccess = useCallback(
    (txHash?: string) => {
      toast.success(
        txHash
          ? "Contract upgraded"
          : "Contract upgrade awaiting Safe confirmation"
      );

      resetForm();
    },
    [resetForm]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Implementation</CardTitle>
      </CardHeader>
      <Form {...form}>
        <CardContent>
          <FormField
            control={form.control}
            name="newImplementationAddress"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Enter new implementation address..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Address needs to be in EVM format.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="justify-end">
          <TransactionButton
            transaction={transaction}
            onSuccess={handleTransactionSuccess}
          >
            Upgrade
          </TransactionButton>
        </CardFooter>
      </Form>
    </Card>
  );
}
