"use client";

import { AddressBook } from "@/components/address-book";
import { type FilecoinAddress } from "@/types/common";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { type Address } from "viem";
import { useChainId } from "wagmi";

const storageKeyBase = "@fidlabs/contracts-admin/on-ramp-clients";

export interface OnRampClientsAddressBookProps {
  onRampContractAddress: Address;
}

export function OnRampClientsAddressBook({
  onRampContractAddress,
}: OnRampClientsAddressBookProps) {
  const { push: navigate } = useRouter();
  const chainId = useChainId();
  const storageKey = useMemo(() => {
    return [storageKeyBase, String(chainId), onRampContractAddress].join("/");
  }, [chainId, onRampContractAddress]);

  const handleSelectAddress = useCallback(
    (address: Address | FilecoinAddress) => {
      navigate(
        `/on-ramp/${chainId}/${onRampContractAddress}/client/${address}`
      );
    },
    [chainId, navigate, onRampContractAddress]
  );

  return (
    <AddressBook
      heading="Select Client to manage"
      storageKey={storageKey}
      onSelectAddress={handleSelectAddress}
    />
  );
}
