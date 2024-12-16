import AllocatorDashboard from "@/components/AllocatorDashboard";
import { useRouter } from "next/router";
import { isAddress } from "viem";

export default function AllocatorPage() {
  const {
    query: { allocatorContractAddress },
  } = useRouter();

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
