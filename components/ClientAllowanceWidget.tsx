import clientABI from "@/abi/Client";
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

export interface ClientAllowanceWidgetProps {
  clientContractAddress: Address;
}

type InputChangeHandler = NonNullable<InputProps["onChange"]>;

export function ClientAllowanceWidget({
  clientContractAddress,
}: ClientAllowanceWidgetProps) {
  const [clientAddress, setClientAddress] = useState("");
  const [allowance, setAllowance] = useState<bigint | null>(null);

  const handleClientAddressChange = useCallback<InputChangeHandler>((event) => {
    setClientAddress(event.target.value.trim());
  }, []);

  const handleTransactionSuccess = useCallback(() => {
    // Reset the form value
    setClientAddress("");
    setAllowance(null);
    toast.success("Client allowance was updated");
  }, []);

  const handleTransactionError = useCallback((error: unknown) => {
    toast.error("Error trying to update client allowance");
    console.error(error);
  }, []);

  const transaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(clientAddress) || allowance === null) {
      return null;
    }

    return {
      to: clientContractAddress,
      data: encodeFunctionData({
        abi: clientABI,
        functionName: "decreaseAllowance",
        args: [clientAddress, allowance],
      }),
      value: "0",
    };
  }, [allowance, clientAddress, clientContractAddress]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <CardTitle>Decrease Client Allowance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          placeholder="Enter allocator address"
          value={clientAddress}
          onChange={handleClientAddressChange}
        />

        <BinaryBytesField
          placeholder="Enter allowance amount to be removed from client"
          allowedUnits={["GiB", "TiB", "PiB"]}
          initialUnit="GiB"
          value={allowance}
          onValueChange={setAllowance}
        />
      </CardContent>

      <CardFooter className="justify-end">
        <TransactionButton
          transaction={transaction}
          onSuccess={handleTransactionSuccess}
          onError={handleTransactionError}
        >
          Decrease Allowance
        </TransactionButton>
      </CardFooter>
    </Card>
  );
}

export default ClientAllowanceWidget;
