import useAllocatorAllowance from "@/hooks/useAllocatorAllowance";
import bytes from "bytes-iec";
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
        {isLoading
          ? "Loading..."
          : allowance
          ? bytes.format(Number(allowance), { mode: "binary" })
          : "-"}
      </TableCell>
    </TableRow>
  );
}

export default AllocatorsTableRow;
