"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { type HTMLAttributes, useCallback, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { Input, type InputProps } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type MaybeBigint = bigint | null;
type ResolvedUnitsList<UnitT extends UnitsList | void> = UnitT extends void
  ? typeof units
  : UnitT;
type Unit = (typeof units)[number];
type Value = MaybeBigint | string;
type ChangeHandler = NonNullable<InputProps["onChange"]>;
export type UnitsList = readonly [Unit, ...Unit[]];
type BaseProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export interface BinaryBytesFieldProps<UnitT extends UnitsList | void = void>
  extends BaseProps {
  allowedUnits?: UnitT;
  initialUnit?: UnitT extends void
    ? Unit | void
    : ResolvedUnitsList<UnitT>[number];
  placeholder?: string;
  value?: Value;
  onValueChange?(nextValue: bigint | null): void;
}

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

export function BinaryBytesField<UnitT extends UnitsList | void = void>({
  allowedUnits,
  className,
  initialUnit,
  placeholder,
  value: controlledValue,
  onValueChange,
  ...rest
}: BinaryBytesFieldProps<UnitT>) {
  const displayedUnits: UnitsList = allowedUnits ?? units;
  const [uncontrolledValue, setUncontrolledValue] = useState<Value>(
    controlledValue ?? null
  );
  const [unit, setUnit] = useState<Unit>(
    initialUnit ?? (displayedUnits as UnitsList)[0]
  );
  const [unitPopoverOpen, setUnitPopoverOpen] = useState(false);
  const magnitude = unitMagnitudeMap[unit];

  const value =
    typeof controlledValue !== "undefined"
      ? controlledValue
      : uncontrolledValue;

  const getBigIntValue = useCallback(
    (stringValue: string): MaybeBigint => {
      if (stringValue === "") {
        return null;
      }

      const intValue = parseInt(stringValue);

      if (isNaN(intValue)) {
        return null;
      }

      const bigIntValue = BigInt(intValue) * magnitudeToBytes(magnitude);
      return bigIntValue;
    },
    [magnitude]
  );

  const updateValue = useCallback(
    (nextValue: MaybeBigint) => {
      if (nextValue === value) {
        return;
      }

      setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  const inputValue = useMemo(() => {
    if (value === null || value === "") {
      return "";
    }

    const bigintValue = typeof value === "string" ? BigInt(value) : value;
    return (bigintValue / magnitudeToBytes(magnitude)).toString();
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
          : (BigInt(value) * magnitudeToBytes(nextMagnitude)) /
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
                {displayedUnits.map((possibleUnit) => (
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
