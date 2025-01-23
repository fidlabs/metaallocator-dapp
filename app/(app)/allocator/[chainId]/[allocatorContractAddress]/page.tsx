import AllocatorDashboard from "@/components/AllocatorDashboard";
import ChainWatcher from "@/components/ChainWatcher";
import { redirect, RedirectType } from "next/navigation";
import { isAddress } from "viem";

interface Params {
  allocatorContractAddress: string;
  chainId: string;
}

interface AllocatorPageProps {
  params: Promise<Params>;
}

const redirectUrl = "/allocator";

export default async function AllocatorPage({ params }: AllocatorPageProps) {
  const { chainId, allocatorContractAddress } = await params;

  if (!isAddress(allocatorContractAddress)) {
    redirect(redirectUrl, RedirectType.replace);
  }

  return (
    <>
      <ChainWatcher
        desiredChainId={parseInt(chainId)}
        redirectUrl={redirectUrl}
      />
      <div className="container mx-auto pb-8">
        <AllocatorDashboard
          allocatorContractAddress={allocatorContractAddress}
        />
      </div>
    </>
  );
}
