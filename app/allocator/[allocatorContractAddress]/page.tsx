import AllocatorDashboard from "@/components/AllocatorDashboard";
import { isAddress } from "viem";

export interface AllocatorPageProps {
  params: {
    allocatorContractAddress: string;
  };
}

// Just so Next shuts up
export async function generateStaticParams(): Promise<
  AllocatorPageProps["params"][]
> {
  return [
    {
      allocatorContractAddress: "0x0",
    },
  ];
}

export default function AllocatorPage({ params }: AllocatorPageProps) {
  return (
    <div className="container mx-auto pb-8">
      {isAddress(params.allocatorContractAddress) && (
        <AllocatorDashboard
          allocatorContractAddress={params.allocatorContractAddress}
        />
      )}
    </div>
  );
}
