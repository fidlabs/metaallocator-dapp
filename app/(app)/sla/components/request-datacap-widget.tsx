"use client";

import { SLAAllocatorAbi } from "@/abi/SLAAllocator";
import BinaryBytesField from "@/components/BinaryBytesField";
import LoaderButton from "@/components/LoaderButton";
import {
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
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type Address, isAddress } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { z } from "zod";

export interface RequestDatacapWidgetProps {
  slaAllocatorAddress: Address;
  slaRegistryAddress: Address;
}

type StorageProviderId = `${"f0" | "t0" | ""}${number}` | "";

const storageProviderIdPrefixRegex = /(?:f0|t0)/g;
const storageProviderIdRegex = /^(?:f0|t0){0,1}[0-9]+$/;

const formSchema = z.object({
  slaRegistry: z.string().refine((value) => {
    return isAddress(value);
  }, "Client address must be a valid ETH address"),
  provider: z.string().refine((value): value is StorageProviderId => {
    return storageProviderIdRegex.test(value);
  }, "Invalid Storage Provider ID"),
  datacap: z.bigint({ coerce: true, message: "Invalid Datacap value" }),
});

export function RequestDatacapWidget({
  slaAllocatorAddress,
  slaRegistryAddress,
}: RequestDatacapWidgetProps) {
  const { data: transactionHash, writeContractAsync } = useWriteContract();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slaRegistry: slaRegistryAddress,
    },
  });

  const {
    reset: resetForm,
    formState: { isSubmitting: isFormSubmitting },
  } = form;

  const handleFormSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const { datacap, provider, slaRegistry } = values;
      const providerIdInteger = BigInt(
        provider.replaceAll(storageProviderIdPrefixRegex, "")
      );

      await writeContractAsync({
        abi: SLAAllocatorAbi,
        address: slaAllocatorAddress,
        functionName: "requestDataCap",
        args: [
          [{ registry: slaRegistry, provider: providerIdInteger }],
          datacap,
        ],
      });
    },
    [slaAllocatorAddress, writeContractAsync]
  );

  const { fetchStatus, status } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  useEffect(() => {
    if (status === "success") {
      toast.success("Datacap Requestes");
      resetForm({
        slaRegistry: slaRegistryAddress,
      });
    }

    if (status === "error") {
      toast.error("Error occurred while requesting Datacap");
    }
  }, [resetForm, slaRegistryAddress, status]);

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardHeader>
            <CardTitle>Request Datacap</CardTitle>
            <CardDescription>
              SLA Allocator contract address: {slaAllocatorAddress}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="slaRegistry"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SLA Registry address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0x"
                        {...field}
                        value={field.value?.toString() ?? ""}
                        disabled
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

              <FormField
                control={form.control}
                name="datacap"
                render={({ field: { onChange, ...restOfFieldProps } }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Datacap</FormLabel>
                    <FormControl>
                      <BinaryBytesField
                        {...restOfFieldProps}
                        className="flex"
                        placeholder="Enter Datacap amount..."
                        allowedUnits={["GiB", "TiB", "PiB"]}
                        initialUnit="GiB"
                        onValueChange={(bi) =>
                          onChange(bi ? bi.toString() : "")
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <LoaderButton
              type="submit"
              loading={isFormSubmitting || fetchStatus === "fetching"}
            >
              Request Datacap
            </LoaderButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
