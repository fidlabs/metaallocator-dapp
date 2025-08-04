"use client";

import { useOnRampAccessControlForAccount } from "@/hooks/use-on-ramp-access-control-for-account";
import { Alert } from "@fidlabs/common-react-ui";
import { type Address } from "viem";
import { useAccount } from "wagmi";

export interface OnRampAccessWarningProps {
  onRampContractAddress: Address;
}

export function OnRampAccessWarning({
  onRampContractAddress,
}: OnRampAccessWarningProps) {
  const { address: accountAddress } = useAccount();
  const { data: onRampAccess, isFetching } = useOnRampAccessControlForAccount({
    onRampContractAddress,
    accountAddress,
  });

  if (isFetching) {
    return null;
  }

  const hasManagerRole = !!onRampAccess?.manager;
  const hasAllocatorRole = !!onRampAccess?.allocator;

  if (hasManagerRole) {
    return null;
  }

  const message = hasAllocatorRole
    ? "Connected account does not have a manager role for this on ramp contract. The actions you can make will be limited."
    : "Connected account does not have a manager or allocator role on this on ramp contract. You won't be able to make any actions on this screen.";

  return <Alert variant="warning">{message}</Alert>;
}
