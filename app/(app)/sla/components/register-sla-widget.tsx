"use client";

import SLARegistryAbi from "@/abi/SLARegistry";
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
  FormDescription,
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

export interface RegisterSLAWidgetProps {
  slaRegistryAddress: Address;
}

type StorageProviderId = `${"f0" | "t0" | ""}${number}` | "";

const storageProviderIdPrefixRegex = /(?:f0|t0)/g;
const storageProviderIdRegex = /^(?:f0|t0){0,1}[0-9]+$/;
const positiveIntegerMessage = "Must be an integer grater than or equal zero";
const percentageMessage = "Must be an integer in a 0-100 range";

const formSchema = z.object({
  client: z.string().refine<string>((value) => {
    return isAddress(value);
  }, "Client address must be a valid ETH address"),
  provider: z.string().refine<string>((value): value is StorageProviderId => {
    return storageProviderIdRegex.test(value);
  }, "Invalid Storage Provider ID"),
  latency: z
    .number({ coerce: true, message: positiveIntegerMessage })
    .min(0, positiveIntegerMessage),
  retention: z
    .number({ coerce: true, message: positiveIntegerMessage })
    .min(0, positiveIntegerMessage),
  bandwidth: z
    .number({ coerce: true, message: positiveIntegerMessage })
    .min(0, positiveIntegerMessage),
  stability: z
    .number({ coerce: true, message: positiveIntegerMessage })
    .min(0, positiveIntegerMessage),
  availability: z
    .number({ coerce: true, message: percentageMessage })
    .min(0, percentageMessage)
    .max(100, percentageMessage),
  indexing: z
    .number({ coerce: true, message: percentageMessage })
    .min(0, percentageMessage)
    .max(100, percentageMessage),
});

export function RegisterSLAWidget({
  slaRegistryAddress,
}: RegisterSLAWidgetProps) {
  const { data: transactionHash, writeContractAsync } = useWriteContract();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      retention: 0,
      stability: 0,
    },
  });

  const {
    reset: resetForm,
    formState: { isSubmitting: isFormSubmitting },
  } = form;

  const handleFormSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const { client, provider, ...restOfValues } = values;
      const providerIdInteger = BigInt(
        provider.replaceAll(storageProviderIdPrefixRegex, "")
      );

      await writeContractAsync({
        abi: SLARegistryAbi,
        address: slaRegistryAddress,
        functionName: "registerSLA",
        args: [
          client as Address,
          providerIdInteger,
          {
            ...restOfValues,
            registered: true,
          },
        ],
      });
    },
    [slaRegistryAddress, writeContractAsync]
  );

  const { fetchStatus, status } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  useEffect(() => {
    if (status === "success") {
      toast.success("SLA registered");
      resetForm();
    }

    if (status === "error") {
      toast.error("Error occurred while registering SLA");
    }
  }, [resetForm, status]);

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardHeader>
            <CardTitle>Register SLA</CardTitle>
            <CardDescription>
              Set SLA parameters for given Client - Provider pair
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Client address</FormLabel>
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

              <div className="mt-4">
                <h3 className="mb-2 text-lg font-medium">SLA Parameters:</h3>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="latency"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Latency (ms)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Eg. 2000"
                            {...field}
                            value={field.value?.toString() ?? ""}
                            type="number"
                            min={0}
                            step={1}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Max TTB (time to first byte) in milliseconds
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bandwidth"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Bandwidth (Mbps)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Eg. 1000 to require a gigabit connection"
                            {...field}
                            value={field.value?.toString() ?? ""}
                            type="number"
                            min={0}
                            step={1}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Minimal bandwith required when accessing data from
                          Provider
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Availability (%)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Eg. 90 for at least 90% of deals to be available for download"
                            {...field}
                            value={field.value?.toString() ?? ""}
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Minimal percentage of on-chain deals that should be
                          available for download from the Provider.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="indexing"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Indexing (%)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Eg. 90 for at least 90% of deals to be registered in IPNI"
                            {...field}
                            value={field.value?.toString() ?? ""}
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Minimal percentage of on-chain deals that should be
                          registered in IPNI.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="retention"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Retention</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0"
                            {...field}
                            value={field.value?.toString() ?? ""}
                            type="number"
                            disabled
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stability"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Stability</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0"
                            {...field}
                            value={field.value?.toString() ?? ""}
                            type="number"
                            disabled
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <LoaderButton
              type="submit"
              loading={isFormSubmitting || fetchStatus === "fetching"}
            >
              Register SLA
            </LoaderButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
