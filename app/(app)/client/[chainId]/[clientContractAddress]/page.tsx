import ChainWatcher from "@/components/ChainWatcher";
import ClientContractDashboard from "@/components/ClientContractDashboard";
import { redirect, RedirectType } from "next/navigation";
import { isAddress } from "viem";

interface Params {
  chainId: string;
  clientContractAddress: string;
}

interface ClientPageProps {
  params: Promise<Params>;
}

const redirectUrl = "/beacon-proxy-factory";

export default async function ClientContractPage({ params }: ClientPageProps) {
  const { chainId, clientContractAddress } = await params;

  if (!isAddress(clientContractAddress)) {
    redirect(redirectUrl, RedirectType.replace);
  }

  return (
    <>
      <ChainWatcher
        desiredChainId={parseInt(chainId)}
        redirectUrl={redirectUrl}
      />

      <ClientContractDashboard clientContractAddress={clientContractAddress} />
    </>
  );
}
