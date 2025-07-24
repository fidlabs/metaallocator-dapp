import ScreenBreadcrumbs from "@/components/ScreenBreadcrumbs";
import { getEthAddressForChain, shortenAddress } from "@/lib/utils";
import { isFilecoinAddress } from "@/types/common";
import { redirect, RedirectType } from "next/navigation";
import { type PropsWithChildren } from "react";
import { isAddress } from "viem";

interface Params {
  onRampContractAddress: string;
  clientAddress: string;
  chainId: string;
}

type OnRampClientLayoutProps = PropsWithChildren<{
  params: Promise<Params>;
}>;

export default async function OnRampClientLayout({
  children,
  params,
}: OnRampClientLayoutProps) {
  const { chainId, clientAddress, onRampContractAddress } = await params;

  const clientAddressIsEthAddress = isAddress(clientAddress);
  const clientAddressIsFilecoinAddress = isFilecoinAddress(clientAddress);

  if (!clientAddressIsEthAddress && !clientAddressIsFilecoinAddress) {
    return redirect(
      `/on-ramp/${chainId}/${onRampContractAddress}`,
      RedirectType.replace
    );
  }

  if (clientAddressIsFilecoinAddress) {
    const ethAddress = await getEthAddressForChain(
      clientAddress,
      parseInt(chainId, 10)
    );
    return redirect(
      ethAddress
        ? `/on-ramp/${chainId}/${onRampContractAddress}/client/${ethAddress}`
        : `/on-ramp/${chainId}/${onRampContractAddress}`
    );
  }

  return (
    <div className="container mx-auto grid gap-8 pb-24">
      <ScreenBreadcrumbs
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "On Ramp",
            href: "/on-ramp",
          },
          {
            label: shortenAddress(onRampContractAddress),
            href: `/on-ramp/${chainId}/${onRampContractAddress}`,
          },
          {
            label: "Clients",
            href: `/on-ramp/${chainId}/${onRampContractAddress}`,
          },
          {
            label: shortenAddress(clientAddress),
          },
        ]}
      />

      <div className="flex flex-col items-center">
        <h2 className="text-center text-xl font-semibold">Manage Client</h2>
        <p className="text-center text-sm text-muted-foreground">
          {clientAddress}
        </p>
      </div>
      {children}
    </div>
  );
}
