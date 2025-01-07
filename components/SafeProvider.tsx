import {
  createSafeClient,
  type SafeClient,
} from "@safe-global/sdk-starter-kit";
import { type ReactElement, useEffect, useState } from "react";
import { useClient, useConnectorClient } from "wagmi";
import SafeContext, { type SafeContextShape } from "./SafeContext";
import SafeApiKit from "@safe-global/api-kit";
import { getCustomSafeTxServiceUrl } from "@/lib/utils";

type RenderProps = Pick<
  SafeContextShape,
  "connected" | "initialized" | "safeAddress"
>;
type RenderFn = (renderProps: RenderProps) => ReactElement;

export interface SafeProviderProps {
  children: RenderFn | ReactElement;
  safeAddress: string | undefined;
}

export function SafeProvider({
  children: childrenOrRenderFn,
  safeAddress,
}: SafeProviderProps) {
  const publicClient = useClient();
  const { data: connectorClient, isLoading } = useConnectorClient();
  const [initialized, setInitialized] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [publicSafeClient, setPublicSafeClient] = useState<SafeClient>();
  const [signerSafeClient, setSignerSafeClient] = useState<SafeClient>();

  useEffect(() => {
    setInitialized(false);
    setPublicSafeClient(undefined);
    setSignerSafeClient(undefined);

    if (!safeAddress || !publicClient) {
      return;
    }

    const txServiceUrl = getCustomSafeTxServiceUrl(publicClient.chain.id);

    const apiKit = new SafeApiKit({
      chainId: BigInt(publicClient.chain.id),
      txServiceUrl,
    });

    apiKit
      .getSafeInfo(safeAddress)
      .then(() => {
        setDeployed(true);

        Promise.all([
          createSafeClient({
            safeAddress,
            provider: publicClient.transport,
            txServiceUrl,
          }),
          connectorClient
            ? createSafeClient({
                safeAddress,
                provider: connectorClient.transport,
                signer: connectorClient.account.address,
                txServiceUrl,
              })
            : Promise.resolve(undefined),
        ])
          .then(([newPublicSafeClient, maybeNewSignerSafeClient]) => {
            setInitialized(true);
            setPublicSafeClient(newPublicSafeClient);
            setSignerSafeClient(maybeNewSignerSafeClient);
          })
          .catch((error) => {
            console.warn("Error intializing Safe clients", error);
          });
      })
      .catch(() => {
        // If the request throws error we assume the safe is not deployed
        setInitialized(true);
        setDeployed(false);
      });
  }, [connectorClient, publicClient, safeAddress]);

  const context: SafeContextShape = {
    connected: !!connectorClient,
    deployed,
    initialized: initialized || isLoading,
    safeAddress,
    publicSafeClient,
    signerSafeClient,
  };

  return (
    <SafeContext.Provider value={context}>
      {typeof childrenOrRenderFn === "function"
        ? childrenOrRenderFn(context)
        : childrenOrRenderFn}
    </SafeContext.Provider>
  );
}

export default SafeProvider;
