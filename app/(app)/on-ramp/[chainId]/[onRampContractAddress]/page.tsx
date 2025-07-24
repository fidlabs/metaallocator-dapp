import ScreenBreadcrumbs from "@/components/ScreenBreadcrumbs";
import { shortenAddress } from "@/lib/utils";
import { isAddress } from "viem";
import { OnRampContractView } from "./components/on-ramp-contract-view";

interface Params {
  onRampContractAddress: string;
  chainId: string;
}

interface OnRampContractPageProps {
  params: Promise<Params>;
}

export default async function OnRampContractPage({
  params,
}: OnRampContractPageProps) {
  const { onRampContractAddress } = await params;

  if (!isAddress(onRampContractAddress)) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <ScreenBreadcrumbs
        className="mb-6"
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "On-Ramp",
            href: "/on-ramp",
          },
          {
            label: shortenAddress(onRampContractAddress),
          },
        ]}
      />
      <OnRampContractView onRampContractAddress={onRampContractAddress} />
    </div>
  );
}
