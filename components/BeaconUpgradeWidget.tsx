import upgradableBeaconABI from "@/abi/UpgradableBeacon";
import type { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { type Address, encodeFunctionData, isAddress } from "viem";
import TransactionButton from "./TransactionButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input, type InputProps } from "./ui/input";

export interface FactoryContractDeployWidgetProps {
  beaconAddress: Address;
}

type ChangeHandler = NonNullable<InputProps["onChange"]>;

export function BeaconUpgradeWidget({
  beaconAddress,
}: FactoryContractDeployWidgetProps) {
  const [nextImplemenationAddress, setNextImplementationAddress] = useState("");
  const transaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(nextImplemenationAddress)) {
      return null;
    }

    return {
      to: beaconAddress,
      data: encodeFunctionData({
        abi: upgradableBeaconABI,
        functionName: "upgradeTo",
        args: [nextImplemenationAddress],
      }),
      value: "0",
    };
  }, [beaconAddress, nextImplemenationAddress]);

  const handleChange = useCallback<ChangeHandler>((event) => {
    setNextImplementationAddress(event.target.value);
  }, []);

  const handleTransactionSuccess = useCallback(
    (ethereumTransactionHash: string | undefined) => {
      setNextImplementationAddress("");
      toast(
        ethereumTransactionHash
          ? "Beacon implemenation was changed succesfully"
          : "Beacon implementation change awaits confirmation"
      );
    },
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Beacon implementation</CardTitle>
      </CardHeader>

      <CardContent>
        <Input
          placeholder="New implementation address"
          value={nextImplemenationAddress}
          onChange={handleChange}
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
    </Card>
  );
}

export default BeaconUpgradeWidget;
