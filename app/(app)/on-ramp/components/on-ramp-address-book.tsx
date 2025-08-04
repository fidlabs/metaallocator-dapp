"use client";

import { AddressBook } from "@/components/address-book";
import { type FilecoinAddress } from "@/types/common";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { type Address } from "viem";
import { useChainId } from "wagmi";

const storageKeyBase = "@fidlabs/contracts-admin/on-ramp-addresses";

export function OnRampAddressBook() {
  const { push: navigate } = useRouter();
  const chainId = useChainId();
  const storageKey = useMemo(() => {
    return storageKeyBase + "/" + String(chainId);
  }, [chainId]);

  const handleSelectAddress = useCallback(
    (address: Address | FilecoinAddress) => {
      navigate(`/on-ramp/${chainId}/${address}`);
    },
    [chainId, navigate]
  );

  return (
    <AddressBook
      heading="Select OnRamp Contract"
      storageKey={storageKey}
      onSelectAddress={handleSelectAddress}
    />
  );
}
