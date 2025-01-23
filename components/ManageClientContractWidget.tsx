"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useCallback, useState } from "react";
import { isAddress } from "viem";
import { useChainId } from "wagmi";

export function ManageClientContractWidget() {
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
    <Card>
      <CardHeader>
        <CardTitle>Manage Client contract</CardTitle>
        <CardDescription>
          Already have Client contract created? Enter it&apos;s address below to
          manage it.
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
  );
}

export default ManageClientContractWidget;
