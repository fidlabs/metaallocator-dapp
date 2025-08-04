import ChainWatcher from "@/components/ChainWatcher";
import { getEthAddressForChain } from "@/lib/utils";
import { isFilecoinAddress } from "@/types/common";
import { redirect, RedirectType } from "next/navigation";
import { type PropsWithChildren } from "react";
import { isAddress } from "viem";

interface Params {
  onRampContractAddress: string;
  chainId: string;
}

type OnRampContractLayoutProps = PropsWithChildren<{
  params: Promise<Params>;
}>;

export default async function OnRampContractLayout({
  children,
  params,
}: OnRampContractLayoutProps) {
  const { chainId, onRampContractAddress } = await params;

  const contractAddressIsEthAddress = isAddress(onRampContractAddress);
  const contractAddressIsFilecoinAddress = isFilecoinAddress(
    onRampContractAddress
  );

  if (!contractAddressIsEthAddress && !contractAddressIsFilecoinAddress) {
    return redirect("/on-ramp", RedirectType.replace);
  }

  if (contractAddressIsFilecoinAddress) {
    const ethAddress = await getEthAddressForChain(
      onRampContractAddress,
      parseInt(chainId, 10)
    );
    return redirect(
      ethAddress ? `/on-ramp/${chainId}/${ethAddress}` : "/on-ramp"
    );
  }

  return (
    <>
      <ChainWatcher desiredChainId={parseInt(chainId)} redirectUrl="/on-ramp" />
      {children}
    </>
  );
}
