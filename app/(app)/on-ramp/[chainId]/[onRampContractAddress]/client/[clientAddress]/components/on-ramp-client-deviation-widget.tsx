"use client";

import onRampABI from "@/abi/OnRamp";
import TransactionButton from "@/components/TransactionButton";
import { useClientMaxDeviation } from "@/hooks/use-client-max-deviation";
import { useOnRampClientContractAddress } from "@/hooks/use-on-ramp-client-contract-address";
import { Input, Skeleton, Slider } from "@fidlabs/common-react-ui";
import { TransactionBase } from "@safe-global/types-kit";
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";

export interface OnRampClientDeviationWidgetProps {
  onRampContractAddress: Address;
  clientAddress: Address;
}

export function OnRampClientDeviationWidget({
  onRampContractAddress,
  clientAddress,
}: OnRampClientDeviationWidgetProps) {
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [nextValue, setNextValue] = useState(50);
  const { data: clientContractAddress } = useOnRampClientContractAddress({
    onRampContractAddress,
  });
  const {
    data: maxDeviation,
    isFetching,
    refetch,
  } = useClientMaxDeviation({
    clientContractAddress,
    clientAddress,
    refetchOnEvents: true,
  });

  const maxDeviationPercentage =
    typeof maxDeviation === "bigint" ? Number(maxDeviation) / 100 : undefined;
  const disabled = typeof maxDeviationPercentage !== "number" || isFetching;

  const transaction = useMemo<TransactionBase | null>(() => {
    if (nextValue < 0 || nextValue > 100) {
      return null;
    }

    return {
      to: onRampContractAddress,
      value: "0",
      data: encodeFunctionData({
        abi: onRampABI,
        functionName: "setClientMaxDeviationFromFairDistribution",
        args: [clientAddress, BigInt(Math.round(nextValue * 100))],
      }),
    };
  }, [clientAddress, nextValue, onRampContractAddress]);

  const handleTransactionStart = useCallback(() => {
    setTransactionInProgress(true);
  }, []);

  const handleTransactionSuccess = useCallback(
    (txHash?: string) => {
      setTransactionInProgress(false);
      refetch({ cancelRefetch: false });

      if (typeof maxDeviationPercentage === "number") {
        setInputValue(maxDeviationPercentage.toString());
        setNextValue(maxDeviationPercentage);
      }

      toast.success(
        txHash
          ? "Client max deviation updated"
          : "Client max deviation update waiting for Safe confirmation"
      );
    },
    [maxDeviationPercentage, refetch]
  );

  const handleTransactionError = useCallback(() => {
    toast.error("An error occured while updating client max deviation");
    setTransactionInProgress(false);
  }, []);

  const handleSliderValueChange = useCallback((values: number[]) => {
    const value = values[0];
    setNextValue(value);
    setInputValue(value.toString());
  }, []);

  const handleInputValueChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((event) => {
    const textValue = event.target.value;
    setInputValue(textValue);

    if (textValue === "") {
      setNextValue(0);
    }

    const numericValue = parseFloat(textValue);

    if (!isNaN(numericValue)) {
      setNextValue(numericValue);
    }
  }, []);

  useEffect(() => {
    if (typeof maxDeviationPercentage === "number") {
      setInputValue(maxDeviationPercentage.toString());
      setNextValue(maxDeviationPercentage);
    }
  }, [maxDeviationPercentage]);

  return (
    <div className="bg-white shadow-f-card rounded-xl p-6 flex items-center gap-4">
      <h3 className="flex items-center gap-1">
        Max Deviation:{" "}
        {typeof maxDeviationPercentage === "number" && !isFetching ? (
          <strong>{maxDeviationPercentage.toFixed(2)}%</strong>
        ) : (
          <Skeleton className="h-[20px] w-[50px]" />
        )}
      </h3>

      <div className="flex-1 flex items-center gap-4">
        <div className="flex-1">
          <Slider
            step={0.01}
            max={100}
            min={0}
            onValueChange={handleSliderValueChange}
            value={[nextValue]}
            disabled={disabled || transactionInProgress}
          />
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            step={0.01}
            min={0}
            max={100}
            value={inputValue}
            onChange={handleInputValueChange}
            placeholder="0"
            disabled={disabled || transactionInProgress}
          />
          <span>%</span>
        </div>
      </div>

      <TransactionButton
        transaction={transaction}
        disabled={disabled || nextValue === maxDeviationPercentage}
        onTransactionStart={handleTransactionStart}
        onSuccess={handleTransactionSuccess}
        onError={handleTransactionError}
      >
        Update
      </TransactionButton>
    </div>
  );
}
