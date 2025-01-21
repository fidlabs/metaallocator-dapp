"use client";

import AppLayout from "@/components/AppLayout";
import ScreenBreadcrumbs from "@/components/ScreenBreadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import {
  ChangeEventHandler,
  useCallback,
  useState,
  type ReactElement,
} from "react";
import { isAddress } from "viem";
import { useChainId } from "wagmi";

export default function ClientPage() {
  const chainId = useChainId();
  const { replace } = useRouter();
  const [inputValue, setInputValue] = useState("");

  const validateAndSetClientContractAddress = useCallback(
    (input: string) => {
      if (isAddress(input)) {
        replace(`/client/${chainId}/${input}`);
        setInputValue("");
      }
    },
    [chainId, replace]
  );

  const handleSetAddressButtonClick = useCallback(() => {
    validateAndSetClientContractAddress(inputValue);
  }, [inputValue, validateAndSetClientContractAddress]);

  const handleInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const previousInputValue = inputValue;
      const nextInputValue = event.target.value;
      setInputValue(nextInputValue);

      if (previousInputValue === "") {
        validateAndSetClientContractAddress(event.target.value);
      }
    },
    [inputValue, validateAndSetClientContractAddress]
  );

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6 pb-8">
      <ScreenBreadcrumbs
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Clients",
          },
        ]}
      />

      <h1 className="text-lg text-center font-semibold">Client Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Enter Client contract address</CardTitle>
          <CardDescription>
            Enter address of specific Client contract you want to manage
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="Client contract address"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button
            disabled={!isAddress(inputValue)}
            onClick={handleSetAddressButtonClick}
          >
            Manage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

ClientPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
