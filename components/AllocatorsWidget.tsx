"use client";

import useAllocators from "@/hooks/useAllocators";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";
import AllocatorsTableRow from "./AllocatorsTableRow";
import type { Address } from "viem";

export interface AllocatorsWidgetProps {
  allocatorContractAddress: Address;
}

export function AllocatorsWidget({
  allocatorContractAddress,
}: AllocatorsWidgetProps) {
  const {
    data: allocators,
    error,
    isLoading,
  } = useAllocators(allocatorContractAddress);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocators List</CardTitle>
      </CardHeader>

      <CardContent>
        {!!allocators && !error && !isLoading && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Allowance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocators.map((allocatorAddress) => (
                <AllocatorsTableRow
                  key={allocatorAddress}
                  allocatorContractAddress={allocatorContractAddress}
                  allocatorAddress={allocatorAddress}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default AllocatorsWidget;
