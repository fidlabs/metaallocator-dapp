import { useAddressDatacap } from "@/hooks/useAddressDatacap";
import { formatBytes } from "@/lib/utils";
import type { Address } from "viem";

export interface AllocatorDatacapProps {
  allocatorContractAddress: Address;
}

export function AllocatorDatacap({
  allocatorContractAddress,
}: AllocatorDatacapProps) {
  const { data: datacap } = useAddressDatacap(allocatorContractAddress);

  return (
    <span>{typeof datacap !== "undefined" ? formatBytes(datacap) : "-"}</span>
  );
}
