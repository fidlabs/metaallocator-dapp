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
          <>
            {allocators.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Allowance</TableHead>
                    <TableHead />
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

            {allocators.length === 0 && (
              <p className="text-sm text-center text-muted-foreground">
                No allocators found.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default AllocatorsWidget;
