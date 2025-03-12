"use client";

import { useAllocatorsWithAllowance } from "@/hooks/use-allocators-with-allowance";
import { isAddress, type Address } from "viem";
import AllocatorsTableRow from "./AllocatorsTableRow";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

export interface AllocatorsWidgetProps {
  allocatorContractAddress: Address;
}

export function AllocatorsWidget({
  allocatorContractAddress,
}: AllocatorsWidgetProps) {
  const {
    data: allocatorsAllowanceMap,
    error,
    isLoading,
  } = useAllocatorsWithAllowance(allocatorContractAddress);

  const content = (() => {
    if (isLoading) {
      return <p className="text-sm text-muted-foreground">Loading...</p>;
    }

    if (!!error) {
      return (
        <p className="text-sm text-muted-foreground">
          Could not load allocators list.
        </p>
      );
    }

    const entries = allocatorsAllowanceMap
      ? Object.entries(allocatorsAllowanceMap)
      : [];

    if (entries.length === 0) {
      return (
        <p className="text-sm text-center text-muted-foreground">
          No allocators found.
        </p>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ethereum Address</TableHead>
            <TableHead>Filecoin Address</TableHead>
            <TableHead className="text-right">Allowance</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(([allocatorAddress, allocatorAllowance]) => {
            if (allocatorAllowance === 0n || !isAddress(allocatorAddress)) {
              return null;
            }

            return (
              <AllocatorsTableRow
                key={allocatorAddress}
                allocatorContractAddress={allocatorContractAddress}
                allocatorAddress={allocatorAddress}
                allocatorAllowance={allocatorAllowance}
              />
            );
          })}
        </TableBody>
      </Table>
    );
  })();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocators List</CardTitle>
      </CardHeader>

      <CardContent>{content}</CardContent>
    </Card>
  );
}

export default AllocatorsWidget;
