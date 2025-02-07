import type { Address } from "viem";
import { AllocatorDatacap } from "./AllocatorDatacap";
import { Card, CardHeader, CardTitle } from "./ui/card";

export interface AllocatorDatacapCardProps {
  allocatorContractAddress: Address;
}

export function AllocatorDatacapCard({
  allocatorContractAddress,
}: AllocatorDatacapCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Allocator Datacap:</span>
          <AllocatorDatacap
            allocatorContractAddress={allocatorContractAddress}
          />
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
