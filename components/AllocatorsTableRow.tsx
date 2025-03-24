import allocatorABI from "@/abi/Allocator";
import { formatBytes, shortenAddress } from "@/lib/utils";
import type { TransactionBase } from "@safe-global/types-kit";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";
import TransactionButton from "./TransactionButton";
import { TableCell, TableRow } from "./ui/table";
import { useFilecoinAddress } from "@/hooks/use-filecoin-address";
import { Button, Skeleton } from "@fidlabs/common-react-ui";
import Link from "next/link";
import { TriangleAlertIcon } from "lucide-react";
import { useChainId } from "wagmi";
import { filecoinCalibration } from "viem/chains";

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
  const chainId = useChainId();
  const explorerBaseUrl =
    "https://" +
    (chainId === filecoinCalibration.id ? "calibration." : "") +
    "filfox.info/en";
  const {
    data: filecoinAddress,
    error: filecoinAddressError,
    isLoading: filecoinAddressLoading,
  } = useFilecoinAddress({
    ethAddress: allocatorAddress,
    robust: true,
  });

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
      <TableCell>
        <Button asChild variant="link">
          <Link
            href={`${explorerBaseUrl}/address/${allocatorAddress}`}
            target="_blank"
            title={allocatorAddress}
          >
            {shortenAddress(allocatorAddress, { leading: 6 })}
          </Link>
        </Button>
      </TableCell>
      <TableCell>
        {filecoinAddressLoading && (
          <div className="py-1">
            <Skeleton className="h-4 w-[66px]" />
          </div>
        )}
        {!filecoinAddressLoading && !!filecoinAddressError && (
          <span
            className="text-yellow-500"
            title="Could not convert from ETH address to Filecoin address"
          >
            <TriangleAlertIcon />
          </span>
        )}
        {!filecoinAddressLoading &&
          !filecoinAddressError &&
          !!filecoinAddress && (
            <Button asChild variant="link">
              <Link
                href={`${explorerBaseUrl}/address/${filecoinAddress}`}
                target="_blank"
              >
                {filecoinAddress}
              </Link>
            </Button>
          )}
      </TableCell>
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
