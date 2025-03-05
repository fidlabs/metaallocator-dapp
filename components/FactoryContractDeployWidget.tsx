import factoryABI from "@/abi/Factory";
import type { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData, isAddress } from "viem";
import RegularTransactionButton from "./RegularTransactionButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input, type InputProps } from "./ui/input";
import { Button } from "@fidlabs/common-react-ui";
import Link from "next/link";

export interface FactoryContractDeployWidgetProps {
  factoryAddress: string;
}

type ChangeHandler = NonNullable<InputProps["onChange"]>;

export function FactoryContractDeployWidget({
  factoryAddress,
}: FactoryContractDeployWidgetProps) {
  const [initialOwnerAddress, setInitialOwnerAddress] = useState("");
  const transaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(initialOwnerAddress)) {
      return null;
    }

    return {
      to: factoryAddress,
      data: encodeFunctionData({
        abi: factoryABI,
        functionName: "deploy",
        args: [initialOwnerAddress],
      }),
      value: "0",
    };
  }, [factoryAddress, initialOwnerAddress]);

  const handleChange = useCallback<ChangeHandler>((event) => {
    setInitialOwnerAddress(event.target.value);
  }, []);

  const handleTransactionSuccess = useCallback(() => {
    setInitialOwnerAddress("");
    toast.success("Contract was deployed");
  }, []);

  const handleTransactionError = useCallback((error: unknown) => {
    toast.error("An error occured when deploying new allocator contract");
    console.error(error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy Contract via Factory</CardTitle>
      </CardHeader>

      <CardContent>
        <Input
          placeholder="Initial Owner Address"
          value={initialOwnerAddress}
          onChange={handleChange}
        />
      </CardContent>

      <CardFooter className="justify-between">
        <p className="text-sm text-muted-foreground">
          Created contracts are instance of <code>Allocator.sol</code> (
          <Button asChild variant="link">
            <Link
              href="https://github.com/fidlabs/contract-metaallocator/blob/main/src/Allocator.sol"
              target="_blank"
            >
              source code
            </Link>
          </Button>
          ), deployed via the <code>Factory.sol</code> contract (
          <Button asChild variant="link">
            <Link
              href="https://github.com/fidlabs/contract-metaallocator/blob/main/src/Factory.sol"
              target="_blank"
            >
              source code
            </Link>
          </Button>
          ).
        </p>
        <RegularTransactionButton
          transaction={transaction}
          onSuccess={handleTransactionSuccess}
          onError={handleTransactionError}
        >
          Deploy
        </RegularTransactionButton>
      </CardFooter>
    </Card>
  );
}

export default FactoryContractDeployWidget;
