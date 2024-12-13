"use client";

import factoryABI from "@/abi/Factory";
import useFactoryAddress from "@/hooks/useFactoryAddress";
import useFactoryOwner from "@/hooks/useFactoryOwner";
import { TransactionBase } from "@safe-global/types-kit";
import { type ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { encodeFunctionData, isAddress } from "viem";
import TransactionButton from "./TransactionButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function FactoryOwnerCard() {
  const factoryAddress = useFactoryAddress();
  const { data: ownerAddress } = useFactoryOwner();
  const [newOwnerAddress, setNewOwnerAddress] = useState("");

  const handleNewOwnerAddressInputChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((event) => {
    const newAddress = event.target.value;
    setNewOwnerAddress(() => newAddress);
  }, []);

  const transaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(newOwnerAddress)) {
      return null;
    }

    return {
      to: factoryAddress,
      data: encodeFunctionData({
        abi: factoryABI,
        functionName: "transferOwnership",
        args: [newOwnerAddress],
      }),
      value: "0",
    };
  }, [factoryAddress, newOwnerAddress]);

  return (
    <Card>
      <Tabs defaultValue="transfer">
        <CardHeader className="flex-col items-start">
          <CardTitle className="text-lg text-primary font-semibold">
            Transfer Factory Ownership
          </CardTitle>
          <CardDescription>
            Current Owner: {ownerAddress ?? "-"}
          </CardDescription>
          <TabsList className="w-full mt-4">
            <TabsTrigger className="flex-1" value="transfer">
              Transfer
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="accept">
              Accept
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <TabsContent value="transfer">
          <CardContent>
            <Input
              placeholder="Enter new owner address..."
              onChange={handleNewOwnerAddressInputChange}
            />
          </CardContent>

          <CardFooter className="justify-end">
            <TransactionButton
              disabled={!transaction}
              transaction={transaction}
            >
              Transfer Ownership
            </TransactionButton>
          </CardFooter>
        </TabsContent>

        <TabsContent value="accept">
          <CardContent>
            <p>Ownership transfer acceptance goes here</p>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default FactoryOwnerCard;
