import factoryABI from "@/abi/Factory";
import type { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useMemo, useState } from "react";
import { encodeFunctionData, isAddress } from "viem";
import TransactionButton from "./TransactionButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input, type InputProps } from "./ui/input";

export interface SetImplementationWidgetProps {
  contractAddress: string;
}

type ChangeHandler = NonNullable<InputProps["onChange"]>;

export function SetImplementationWidget({
  contractAddress,
}: SetImplementationWidgetProps) {
  const [newImplementationAddress, setNewImplementationAddress] = useState("");
  const transaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(newImplementationAddress)) {
      return null;
    }

    return {
      to: contractAddress,
      data: encodeFunctionData({
        abi: factoryABI,
        functionName: "setImplementation",
        args: [newImplementationAddress],
      }),
      value: "0",
    };
  }, [contractAddress, newImplementationAddress]);

  const handleChange = useCallback<ChangeHandler>((event) => {
    setNewImplementationAddress(event.target.value);
  }, []);

  const handleTransactionSuccess = useCallback(() => {
    setNewImplementationAddress("");
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Implementation</CardTitle>
      </CardHeader>

      <CardContent>
        <Input
          placeholder="New implementatation address"
          value={newImplementationAddress}
          onChange={handleChange}
        />
      </CardContent>

      <CardFooter className="justify-end">
        <TransactionButton
          transaction={transaction}
          onSuccess={handleTransactionSuccess}
        >
          Change
        </TransactionButton>
      </CardFooter>
    </Card>
  );
}

export default SetImplementationWidget;
