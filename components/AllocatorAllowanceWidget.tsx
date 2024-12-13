import allocatorABI from "@/abi/Allocator";
import { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useMemo, useState } from "react";
import { type Address, encodeFunctionData, isAddress } from "viem";
import TransactionButton from "./TransactionButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input, InputProps } from "./ui/input";
import BinaryBytesField from "./BinaryBytesField";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { cn } from "@/lib/utils";

export interface AllocatorCreatorProps {
  allocatorContractAddress: Address;
}

type InputChangeHandler = NonNullable<InputProps["onChange"]>;

enum Mode {
  ADD = "add",
  RESET = "reset",
}

const modeDict: Record<Mode, string> = {
  [Mode.ADD]: "Add",
  [Mode.RESET]: "Reset",
};

export function AllocatorAllowanceWidget({
  allocatorContractAddress,
}: AllocatorCreatorProps) {
  const [allocatorAddress, setAllocatorAddress] = useState("");
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const [mode, setMode] = useState(Mode.ADD);
  const [modePopoverOpen, setModePopoverOpen] = useState(false);
  const allowanceValue = mode === Mode.RESET ? 0n : allowance;

  const handleAllocatorAddressChange = useCallback<InputChangeHandler>(
    (event) => {
      setAllocatorAddress(event.target.value.trim());
    },
    []
  );

  const handleModeSelect = useCallback((input: string) => {
    setMode(input as Mode);
    setModePopoverOpen(false);
  }, []);

  const handleTransactionSuccess = useCallback(() => {
    // Reset the form value
    setAllocatorAddress("");
    setAllowance(null);
  }, []);

  const transaction = useMemo<TransactionBase | null>(() => {
    if (!isAddress(allocatorAddress) || allowanceValue === null) {
      return null;
    }

    if (mode === Mode.ADD && allowanceValue <= 0n) {
      return null;
    }

    return {
      to: allocatorContractAddress,
      data: encodeFunctionData({
        abi: allocatorABI,
        functionName: mode === Mode.RESET ? "setAllowance" : "addAllowance",
        args: [allocatorAddress, allowanceValue],
      }),
      value: "0",
    };
  }, [allocatorAddress, allocatorContractAddress, allowanceValue, mode]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <CardTitle>Manage Allocator Allowance</CardTitle>

        <div className="flex items-center gap-2">
          <p>Mode:</p>
          <Popover open={modePopoverOpen} onOpenChange={setModePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                className="w-24 justify-between"
                variant="outline"
                size="sm"
              >
                {modeDict[mode]}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-24 p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {Object.values(Mode).map((possibleMode) => (
                      <CommandItem
                        key={possibleMode}
                        value={possibleMode}
                        onSelect={handleModeSelect}
                      >
                        {modeDict[possibleMode]}

                        <Check
                          className={cn(
                            "ml-auto",
                            possibleMode === mode ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          placeholder="Enter allocator address"
          value={allocatorAddress}
          onChange={handleAllocatorAddressChange}
        />

        {mode === Mode.ADD && (
          <BinaryBytesField
            placeholder="Enter allowance amount to be added"
            initialUnit="GiB"
            value={allowanceValue}
            onValueChange={setAllowance}
          />
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <TransactionButton
          transaction={transaction}
          onSuccess={handleTransactionSuccess}
        >
          {mode === Mode.RESET ? "Reset Allowance" : "Add Allowance"}
        </TransactionButton>
      </CardFooter>
    </Card>
  );
}

export default AllocatorAllowanceWidget;
