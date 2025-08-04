import beaconProxyFactoryABI from "@/abi/BeaconProxyFactory";
import type { TransactionBase } from "@safe-global/types-kit";
import { Check, Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { type Address, encodeFunctionData, isAddress } from "viem";
import { useWatchContractEvent } from "wagmi";
import RegularTransactionButton from "./RegularTransactionButton";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input, type InputProps } from "./ui/input";

export interface CreateClientWidgetProps {
  beaconProxyFactoryAddress: Address;
}

type ChangeHandler = NonNullable<InputProps["onChange"]>;

export function CreateClientWidget({
  beaconProxyFactoryAddress,
}: CreateClientWidgetProps) {
  const [managerAddress, setManagerAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState<string>();
  const [createdContractAddress, setCreatedContractAddress] =
    useState<Address>();
  const shouldShowForm = !transactionHash && !createdContractAddress;
  const shouldShowLoader = !!transactionHash && !createdContractAddress;

  const transaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(managerAddress)) {
      return null;
    }

    return {
      to: beaconProxyFactoryAddress,
      data: encodeFunctionData({
        abi: beaconProxyFactoryABI,
        functionName: "create",
        args: [managerAddress],
      }),
      value: "0",
    };
  }, [beaconProxyFactoryAddress, managerAddress]);

  const handleChange = useCallback<ChangeHandler>((event) => {
    setManagerAddress(event.target.value);
  }, []);

  const clear = useCallback(() => {
    setTransactionHash(undefined);
    setCreatedContractAddress(undefined);
  }, []);

  useWatchContractEvent({
    abi: beaconProxyFactoryABI,
    address: beaconProxyFactoryAddress,
    eventName: "ProxyCreated",
    onLogs(logs) {
      const createdContactLog = logs.find((log) => {
        return log.transactionHash === transactionHash && !!log.args.proxy;
      });

      if (createdContactLog) {
        setCreatedContractAddress(createdContactLog.args.proxy);
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Client contract</CardTitle>
      </CardHeader>

      {shouldShowForm && (
        <>
          <CardContent>
            <Input
              className="mb-2"
              placeholder="Manager Address"
              value={managerAddress}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground pl-3">
              Address that will be the initial owner of the newly created Client
              contract.
            </p>
          </CardContent>

          <CardFooter className="justify-end">
            <RegularTransactionButton
              transaction={transaction}
              onTransactionHash={setTransactionHash}
            >
              Create
            </RegularTransactionButton>
          </CardFooter>
        </>
      )}

      {shouldShowLoader && (
        <CardContent className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-dodger-blue" />
          <p className="text-center max-w-[640px] text-sm">
            You transaction is pending. Do not close this tab or refresh the
            page. Once the transaction passes you will see the newly created
            Client contract address here.
          </p>
        </CardContent>
      )}

      {!!createdContractAddress && (
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-[48px] aspect-square bg-green-300 flex flex-col items-center justify-center rounded-full">
            <Check size={28} />
          </div>
          <p className="text-center">
            A new Client contract was successfuly deployed at{" "}
          </p>
          <pre className="font-mono text-center">{createdContractAddress}</pre>
          <Button onClick={clear}>Create another</Button>
        </CardContent>
      )}
    </Card>
  );
}

export default CreateClientWidget;
