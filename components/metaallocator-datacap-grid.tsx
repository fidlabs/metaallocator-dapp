import { useAllocatorsWithAllowance } from "@/hooks/use-allocators-with-allowance";
import { useAddressDatacap } from "@/hooks/useAddressDatacap";
import { cn, formatBytes } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@fidlabs/common-react-ui";
import { TriangleAlertIcon } from "lucide-react";
import { type Address } from "viem";

export interface MetaallocatorDatacapGridProps {
  metaallocatorContractAddress: Address;
}

function Value({ colors = false, value }: { colors?: boolean; value: bigint }) {
  return (
    <p
      className={cn({
        "text-destructive": colors && value < 0n,
        "text-yellow-500": colors && value === 0n,
      })}
    >
      {formatBytes(value)}
    </p>
  );
}

function ValueLoader() {
  return <Skeleton className="h-6 w-[250px]" />;
}

function Error() {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <TriangleAlertIcon size={12} />
      <p className="text-sm">Error loading data</p>
    </div>
  );
}

function ValueDisplay({
  colors,
  error,
  isLoading,
  value,
}: {
  colors?: boolean;
  error: Error | null;
  isLoading: boolean;
  value: bigint | undefined;
}) {
  return (
    <>
      {isLoading && <ValueLoader />}

      {!isLoading && !!error && <Error />}

      {!isLoading && !error && typeof value === "bigint" && (
        <Value colors={colors} value={value} />
      )}
    </>
  );
}

export function MetaallocatorDatacapGrid({
  metaallocatorContractAddress,
}: MetaallocatorDatacapGridProps) {
  const {
    data: contractDatacap,
    error: contractDatacapError,
    isLoading: contractDatacapLoading,
  } = useAddressDatacap(metaallocatorContractAddress);
  const {
    data: allocatorsAllowanceMap,
    error: allocatorsAllowanceError,
    isLoading: allocatorsAllowanceLoading,
  } = useAllocatorsWithAllowance(metaallocatorContractAddress);

  const allocatedDatacap = allocatorsAllowanceMap
    ? Object.values(allocatorsAllowanceMap).reduce(
        (total, allocatorAllowance) => total + allocatorAllowance,
        0n
      )
    : undefined;

  const unallocatedDatacap =
    typeof contractDatacap !== "undefined" &&
    typeof allocatedDatacap !== "undefined"
      ? contractDatacap - allocatedDatacap
      : undefined;

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Contract Datacap</CardTitle>
          <CardDescription>
            Datacap remaining on metaallocator contract
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ValueDisplay
            isLoading={contractDatacapLoading}
            error={contractDatacapError}
            value={contractDatacap}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allocated Datacap</CardTitle>
          <CardDescription>
            Datacap currently allocated to allocators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ValueDisplay
            isLoading={allocatorsAllowanceLoading}
            error={allocatorsAllowanceError}
            value={allocatedDatacap}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unallocated Datacap</CardTitle>
          <CardDescription>
            Difference between DC available on contract and allocated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ValueDisplay
            colors
            isLoading={contractDatacapLoading || allocatorsAllowanceLoading}
            error={contractDatacapError || allocatorsAllowanceError}
            value={unallocatedDatacap}
          />
        </CardContent>
      </Card>
    </div>
  );
}
