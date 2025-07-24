import { isAddress } from "viem";
import { OnRampClientView } from "./components/on-ramp-client-view";

interface Params {
  chainId: string;
  onRampContractAddress: string;
  clientAddress: string;
}

interface OnRampClientPageProps {
  params: Promise<Params>;
}

export default async function OnRampClientPage({
  params,
}: OnRampClientPageProps) {
  const { onRampContractAddress, clientAddress } = await params;

  if (!isAddress(onRampContractAddress) || !isAddress(clientAddress)) {
    return null;
  }

  return (
    <OnRampClientView
      onRampContractAddress={onRampContractAddress}
      clientAddress={clientAddress}
    />
  );
}
