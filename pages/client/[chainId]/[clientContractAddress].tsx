import AppLayout from "@/components/AppLayout";
import ClientContractDashboard from "@/components/ClientContractDashboard";
import { useRouter } from "next/router";
import { type ReactElement, useEffect } from "react";
import { isAddress } from "viem";
import { useChainId } from "wagmi";

export default function ClientContractPage() {
  const {
    query: { clientContractAddress, chainId: providedChainId },
    replace,
  } = useRouter();
  const chainId = useChainId();
  const invalidChain =
    typeof providedChainId === "string" &&
    parseInt(providedChainId) !== chainId;

  useEffect(() => {
    if (invalidChain) {
      replace("/");
    }

    if (
      typeof clientContractAddress === "string" &&
      !isAddress(clientContractAddress)
    ) {
      replace("/client");
    }
  }, [clientContractAddress, invalidChain, replace]);

  return typeof clientContractAddress === "string" &&
    isAddress(clientContractAddress) ? (
    <ClientContractDashboard clientContractAddress={clientContractAddress} />
  ) : null;
}

ClientContractPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
