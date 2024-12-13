"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { HTMLAttributes, useCallback, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { Input, InputProps } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type BaseProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export interface BinaryBytesFieldProps extends BaseProps {
  initialUnit?: Unit;
  placeholder?: string;
  value?: Value;
  onValueChange?(nextValue: bigint | null): void;
}

type Unit = (typeof units)[number];
type Value = bigint | null;
type ChangeHandler = NonNullable<InputProps["onChange"]>;

const units = [
  "B",
  "kiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB",
] as const;

const unitMagnitudeMap = units.reduce((result, unit, index) => {
  return {
    ...result,
    [unit]: BigInt(index),
  };
}, {}) as Record<Unit, bigint>;

export function BinaryBytesField({
  className,
  initialUnit = units[0],
  placeholder,
  value: controlledValue,
  onValueChange,
  ...rest
}: BinaryBytesFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<Value>(
    controlledValue ?? null
  );
  const [unit, setUnit] = useState(initialUnit);
  const [unitPopoverOpen, setUnitPopoverOpen] = useState(false);
  const magnitude = unitMagnitudeMap[unit];

  const value =
    typeof controlledValue !== "undefined"
      ? controlledValue
      : uncontrolledValue;

  const getBigIntValue = useCallback(
    (stringValue: string): Value | undefined => {
      if (stringValue === "") {
        return null;
      }

      const intValue = parseInt(stringValue);

      if (isNaN(intValue)) {
        return;
      }

      const bigIntValue = BigInt(intValue) * magnitudeToBytes(magnitude);
      return bigIntValue;
    },
    [magnitude]
  );

  const updateValue = useCallback(
    (nextValue: Value) => {
      if (nextValue === value) {
        return;
      }

      setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  const inputValue = useMemo(() => {
    if (value === null) {
      return "";
    }

    return (value / magnitudeToBytes(magnitude)).toString();
  }, [magnitude, value]);

  const handleInputChange = useCallback<ChangeHandler>(
    (event) => {
      const bigIntValue = getBigIntValue(event.target.value);

      if (typeof bigIntValue !== "undefined") {
        updateValue(bigIntValue);
      }
    },
    [getBigIntValue, updateValue]
  );

  const handleUnitSelect = useCallback(
    (input: string) => {
      // Normally would use a type guard but we are sure here it matches the type
      const nextUnit = input as Unit;
      const nextMagnitude = unitMagnitudeMap[nextUnit];
      const nextValue =
        value === null
          ? null
          : (value * magnitudeToBytes(nextMagnitude)) /
            magnitudeToBytes(magnitude);

      updateValue(nextValue);

      setUnit(nextUnit);
      setUnitPopoverOpen(false);
    },
    [magnitude, updateValue, value]
  );

  return (
    <div {...rest} className={cn("inline-flex items-center gap-2", className)}>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
      <Popover open={unitPopoverOpen} onOpenChange={setUnitPopoverOpen}>
        <PopoverTrigger asChild>
          <Button className="min-w-24 px-3 justify-between" variant="outline">
            {unit} <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-24 p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                {units.map((possibleUnit) => (
                  <CommandItem
                    key={possibleUnit}
                    value={possibleUnit}
                    onSelect={handleUnitSelect}
                  >
                    {possibleUnit}

                    <Check
                      className={cn(
                        "ml-auto",
                        possibleUnit === unit ? "opacity-100" : "opacity-0"
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
  );
}

function magnitudeToBytes(magnitude: bigint): bigint {
  return 1024n ** magnitude;
}

export default BinaryBytesField;