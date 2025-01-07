import AllocatorDashboard from "@/components/AllocatorDashboard";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAddress } from "viem";
import { useChainId } from "wagmi";

export default function AllocatorPage() {
  const {
    query: { allocatorContractAddress, chainId: providedChainId },
    replace,
  } = useRouter();
  const chainId = useChainId();

  const chainIdNumber =
    typeof providedChainId === "string" ? parseInt(providedChainId) : NaN;
  const invalidChain = isNaN(chainIdNumber) || chainIdNumber !== chainId;

  useEffect(() => {
    if (invalidChain) {
      replace("/");
    }
  }, [invalidChain, replace]);

  return (
    <div className="container mx-auto pb-8">
      {typeof allocatorContractAddress === "string" &&
        isAddress(allocatorContractAddress) && (
          <AllocatorDashboard
            allocatorContractAddress={allocatorContractAddress}
          />
        )}
    </div>
  );
}
