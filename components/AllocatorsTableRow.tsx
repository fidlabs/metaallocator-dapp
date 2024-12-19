import useAllocatorAllowance from "@/hooks/useAllocatorAllowance";
import { formatBytes } from "@/lib/utils";
import type { Address } from "viem";
import { TableCell, TableRow } from "./ui/table";

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

  return (
    <TableRow>
      <TableCell>{allocatorAddress}</TableCell>
      <TableCell className="text-right">
        {isLoading ? "Loading..." : allowance ? formatBytes(allowance) : "-"}
      </TableCell>
    </TableRow>
  );
}

export default AllocatorsTableRow;
