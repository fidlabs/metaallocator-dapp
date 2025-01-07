import allocatorABI from "@/abi/Allocator";
import { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { type Address, encodeFunctionData, isAddress } from "viem";
import BinaryBytesField from "./BinaryBytesField";
import TransactionButton from "./TransactionButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input, InputProps } from "./ui/input";

export interface AllocatorCreatorProps {
  allocatorContractAddress: Address;
}

type InputChangeHandler = NonNullable<InputProps["onChange"]>;

export function AllocatorAllowanceWidget({
  allocatorContractAddress,
}: AllocatorCreatorProps) {
  const [allocatorAddress, setAllocatorAddress] = useState("");
  const [allowance, setAllowance] = useState<bigint | null>(null);

  const handleAllocatorAddressChange = useCallback<InputChangeHandler>(
    (event) => {
      setAllocatorAddress(event.target.value.trim());
    },
    []
  );

  const handleTransactionSuccess = useCallback(() => {
    // Reset the form value
    setAllocatorAddress("");
    setAllowance(null);
    toast("Allowance was updated");
  }, []);

  const transaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(allocatorAddress) || allowance === null) {
      return null;
    }

    return {
      to: allocatorContractAddress,
      data: encodeFunctionData({
        abi: allocatorABI,
        functionName: "addAllowance",
        args: [allocatorAddress, allowance],
      }),
      value: "0",
    };
  }, [allocatorAddress, allocatorContractAddress, allowance]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <CardTitle>Manage Allocator Allowance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          placeholder="Enter allocator address"
          value={allocatorAddress}
          onChange={handleAllocatorAddressChange}
        />

        <BinaryBytesField
          placeholder="Enter allowance amount to be added"
          initialUnit="GiB"
          value={allowance}
          onValueChange={setAllowance}
        />
      </CardContent>

      <CardFooter className="justify-end">
        <TransactionButton
          transaction={transaction}
          onSuccess={handleTransactionSuccess}
        >
          Add Allowance
        </TransactionButton>
      </CardFooter>
    </Card>
  );
}

export default AllocatorAllowanceWidget;
