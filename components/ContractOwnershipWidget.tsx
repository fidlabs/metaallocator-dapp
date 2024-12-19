"use client";

import ownable2StepABI from "@/abi/Ownable2Step";
import useOwnable2StepOwner from "@/hooks/useOwnable2StepOwner";
import useOwnable2StepPendingOwner from "@/hooks/useOwnable2StepPendingOwner";
import { TransactionBase } from "@safe-global/types-kit";
import { type ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { Address, encodeFunctionData, isAddress, isAddressEqual } from "viem";
import { useAccount } from "wagmi";
import MultisigOwnershipAcceptForm from "./MultisigOwnershipAcceptForm";
import SafeGuard from "./SafeGuard";
import SafeProvider from "./SafeProvider";
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
import RegularTransactionButton from "./RegularTransactionButton";
import { Loader2 } from "lucide-react";

export interface ContractOwnershipWidgetProps {
  contractAddress: Address;
}

export function ContractOwnershipWidget({
  contractAddress,
}: ContractOwnershipWidgetProps) {
  const { address: accountAddress } = useAccount();
  const [tab, setTab] = useState("transfer");
  const { data: ownerAddress, refetch: refetchOwner } =
    useOwnable2StepOwner(contractAddress);
  const { data: pendingOwnerAddress, refetch: refetchPendingOwner } =
    useOwnable2StepPendingOwner(contractAddress);
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const hasPendingOwner =
    typeof pendingOwnerAddress !== "undefined" &&
    BigInt(pendingOwnerAddress) !== 0n;

  const handleNewOwnerAddressInputChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((event) => {
    const newAddress = event.target.value;
    setNewOwnerAddress(() => newAddress);
  }, []);

  const transferOwnershipTransaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(newOwnerAddress)) {
      return null;
    }

    return {
      to: contractAddress,
      data: encodeFunctionData({
        abi: ownable2StepABI,
        functionName: "transferOwnership",
        args: [newOwnerAddress],
      }),
      value: "0",
    };
  }, [contractAddress, newOwnerAddress]);

  const acceptOwnershipTransaction = useMemo<TransactionBase>(() => {
    return {
      to: contractAddress,
      data: encodeFunctionData({
        abi: ownable2StepABI,
        functionName: "acceptOwnership",
      }),
      value: "0",
    };
  }, [contractAddress]);

  const handleOwnershipTransferred = useCallback(() => {
    setNewOwnerAddress("");
    refetchPendingOwner().then(({ data: pendingOwnerAddress }) => {
      if (pendingOwnerAddress && BigInt(pendingOwnerAddress) !== 0n) {
        setTab("accept");
      }
    });
  }, [refetchPendingOwner]);

  const handleOwnershipAccepted = useCallback(() => {
    refetchOwner();
    refetchPendingOwner();
    setTab("transfer");
  }, [refetchOwner, refetchPendingOwner]);

  return (
    <Card>
      <Tabs value={tab} onValueChange={setTab}>
        <CardHeader className="flex-col items-start">
          <CardTitle className="text-lg text-primary font-semibold">
            Manage Contract Ownership
          </CardTitle>
          <CardDescription>
            Current Owner: {ownerAddress ?? "-"}
          </CardDescription>
          <TabsList className="w-full mt-4">
            <TabsTrigger className="flex-1" value="transfer">
              Transfer
            </TabsTrigger>
            <TabsTrigger
              className="flex-1"
              value="accept"
              disabled={!hasPendingOwner}
            >
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
              transaction={transferOwnershipTransaction}
              onSuccess={handleOwnershipTransferred}
            >
              Transfer Ownership
            </TransactionButton>
          </CardFooter>
        </TabsContent>

        {hasPendingOwner && (
          <TabsContent value="accept">
            <CardContent>
              <p>Ownership transfer to {pendingOwnerAddress} initiated</p>
            </CardContent>
            <CardFooter className="justify-end">
              <SafeProvider safeAddress={pendingOwnerAddress}>
                <SafeGuard
                  notConnectedFallback={false}
                  notDeployedFallback={
                    <RegularTransactionButton
                      disabled={
                        !accountAddress ||
                        !pendingOwnerAddress ||
                        !isAddressEqual(accountAddress, pendingOwnerAddress)
                      }
                      transaction={acceptOwnershipTransaction}
                      onSuccess={handleOwnershipAccepted}
                    >
                      Accept Ownership
                    </RegularTransactionButton>
                  }
                  notInitializedFallback={
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-muted-foreground">
                        Initializing Safe
                      </p>
                      <Loader2 className="animate-spin" />
                    </div>
                  }
                >
                  <MultisigOwnershipAcceptForm
                    acceptOwnershipTransaction={acceptOwnershipTransaction}
                    onOwnershipAccepted={handleOwnershipAccepted}
                  />
                </SafeGuard>
              </SafeProvider>
            </CardFooter>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}

export default ContractOwnershipWidget;
