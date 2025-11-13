"use client";

import beneficiaryFactoryAbi from "@/abi/BeneficiaryFactory";
import RegularTransactionButton from "@/components/RegularTransactionButton";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
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
import type { TransactionBase } from "@safe-global/types-kit";
import { Check, Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { type Address, encodeFunctionData, isAddress } from "viem";
import { useWatchContractEvent } from "wagmi";
import { z } from "zod";

export interface BeneficiaryContractDeployWidgetProps {
  factoryAddress: Address;
}

type StorageProviderId = `${"f0" | "t0" | ""}${number}` | "";

const storageProviderIdPrefixRegex = /(?:f0|t0)/g;
const storageProviderIdRegex = /^(?:f0|t0){0,1}[0-9]+$/;

const formSchema = z.object({
  admin: z.string().refine<string>((value) => {
    return isAddress(value);
  }, "Invalid Admin address"),
  withdrawer: z.string().refine<string>((value) => {
    return isAddress(value);
  }, "Invalid Withdrawer address"),
  provider: z.string().refine<string>((value): value is StorageProviderId => {
    return storageProviderIdRegex.test(value);
  }, "Invalid Storage Provider ID"),
});

export function BeneficiaryContractDeployWidget({
  factoryAddress,
}: BeneficiaryContractDeployWidgetProps) {
  const [transactionHash, setTransactionHash] = useState<string>();
  const [createdContractAddress, setCreatedContractAddress] =
    useState<Address>();
  const shouldShowForm = !transactionHash && !createdContractAddress;
  const shouldShowLoader = !!transactionHash && !createdContractAddress;

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { reset: resetForm } = form;

  const values = useWatch({
    control: form.control,
  });

  const transaction = useMemo<TransactionBase | null>(() => {
    const validationResult = formSchema.safeParse(values);

    if (!validationResult.success) {
      return null;
    }

    const { admin, provider, withdrawer } = validationResult.data;

    const providerIdInteger = BigInt(
      provider.replaceAll(storageProviderIdPrefixRegex, "")
    );

    return {
      to: factoryAddress,
      data: encodeFunctionData({
        abi: beneficiaryFactoryAbi,
        functionName: "create",
        args: [admin as Address, withdrawer as Address, providerIdInteger],
      }),
      value: "0",
    };
  }, [factoryAddress, values]);

  const clear = useCallback(() => {
    resetForm();
    setTransactionHash(undefined);
    setCreatedContractAddress(undefined);
  }, [resetForm]);

  useWatchContractEvent({
    abi: beneficiaryFactoryAbi,
    address: factoryAddress,
    eventName: "ProxyCreated",
    poll: true,
    pollingInterval: 2_000,
    onLogs(logs) {
      const createdContactLog = logs.find((log) => {
        return log.transactionHash === transactionHash && !!log.args.proxy;
      });

      if (createdContactLog) {
        setCreatedContractAddress(createdContactLog.args.proxy);
      }
    },
  });

  return (
    <Card>
      <Form {...form}>
        <CardHeader>
          <CardTitle>Create Beneficiary contract</CardTitle>
          <CardDescription>Factory address: {factoryAddress}</CardDescription>
        </CardHeader>

        {shouldShowForm && (
          <>
            <CardContent>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="admin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Admin address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x"
                          {...field}
                          value={field.value?.toString() ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="withdrawer"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Withdrawer address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x"
                          {...field}
                          value={field.value?.toString() ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Provider ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="f0"
                          {...field}
                          value={field.value?.toString() ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="justify-end">
              <RegularTransactionButton
                transaction={transaction}
                onTransactionHash={setTransactionHash}
              >
                Create
              </RegularTransactionButton>
            </CardFooter>
          </>
        )}

        {shouldShowLoader && (
          <CardContent className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-dodger-blue" />
            <p className="text-center max-w-[640px] text-sm">
              You transaction is pending. Do not close this tab or refresh the
              page. Once the transaction passes you will see the newly created
              Beneficiary contract address here.
            </p>
          </CardContent>
        )}

        {!!createdContractAddress && (
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-[48px] aspect-square bg-green-300 flex flex-col items-center justify-center rounded-full">
              <Check size={28} />
            </div>
            <p className="text-center">
              A new Beneficiary contract was successfuly deployed at{" "}
            </p>
            <pre className="font-mono text-center">
              {createdContractAddress}
            </pre>
            <Button onClick={clear}>Create another</Button>
          </CardContent>
        )}
      </Form>
    </Card>
  );
}
