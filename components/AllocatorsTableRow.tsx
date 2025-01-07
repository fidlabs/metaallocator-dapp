import allocatorABI from "@/abi/Allocator";
import useAllocatorAllowance from "@/hooks/useAllocatorAllowance";
import { formatBytes } from "@/lib/utils";
import type { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useMemo } from "react";
import { encodeFunctionData, type Address } from "viem";
import TransactionButton from "./TransactionButton";
import { TableCell, TableRow } from "./ui/table";
import { toast } from "sonner";

export interface AllocatorsTableRowProps {
  allocatorAddress: Address;
  allocatorContractAddress: Address;
}

export function AllocatorsTableRow({
  allocatorAddress,
  allocatorContractAddress,
}: AllocatorsTableRowProps) {
  const { data: allowance, isLoading } = useAllocatorAllowance(
    allocatorContractAddress,
    allocatorAddress
  );

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
        {isLoading ? "Loading..." : allowance ? formatBytes(allowance) : "-"}
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
