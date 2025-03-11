import allocatorABI from "@/abi/Allocator";
import { formatBytes } from "@/lib/utils";
import type { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";
import TransactionButton from "./TransactionButton";
import { TableCell, TableRow } from "./ui/table";

export interface AllocatorsTableRowProps {
  allocatorAddress: Address;
  allocatorAllowance: bigint;
  allocatorContractAddress: Address;
}

export function AllocatorsTableRow({
  allocatorAddress,
  allocatorAllowance,
  allocatorContractAddress,
}: AllocatorsTableRowProps) {
  const resetAllowanceTransaction = useMemo<TransactionBase>(() => {
    return {
      to: allocatorContractAddress,
      data: encodeFunctionData({
        abi: allocatorABI,
        functionName: "setAllowance",
        args: [allocatorAddress, 0n],
      }),
      value: "0",
    };
  }, [allocatorAddress, allocatorContractAddress]);

  const handleResetAllowanceSuccess = useCallback(() => {
    toast("Allowance was reset");
  }, []);

  return (
    <TableRow>
      <TableCell>{allocatorAddress}</TableCell>
      <TableCell className="text-right">
        {formatBytes(allocatorAllowance)}
      </TableCell>
      <TableCell className="text-right">
        <TransactionButton
          transaction={resetAllowanceTransaction}
          onSuccess={handleResetAllowanceSuccess}
        >
          Reset Allowance
        </TransactionButton>
      </TableCell>
    </TableRow>
  );
}

export default AllocatorsTableRow;
