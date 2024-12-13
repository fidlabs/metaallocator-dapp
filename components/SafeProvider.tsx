import {
  createSafeClient,
  type SafeClient,
} from "@safe-global/sdk-starter-kit";
import { type ReactElement, useEffect, useState } from "react";
import { useClient, useConnectorClient } from "wagmi";
import SafeContext, { type SafeContextShape } from "./SafeContext";

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
  const [publicSafeClient, setPublicSafeClient] = useState<SafeClient>();
  const [signerSafeClient, setSignerSafeClient] = useState<SafeClient>();

  useEffect(() => {
    setInitialized(false);
    setPublicSafeClient(undefined);
    setSignerSafeClient(undefined);

    if (!safeAddress || !publicClient) {
      return;
    }

    Promise.all([
      createSafeClient({
        safeAddress,
        provider: publicClient.transport,
        txServiceUrl:
          "https://transaction-testnet.staging.safe.filecoin.io/api",
      }),
      connectorClient
        ? createSafeClient({
            safeAddress,
            provider: connectorClient.transport,
            signer: connectorClient.account.address,
            txServiceUrl:
              "https://transaction-testnet.staging.safe.filecoin.io/api",
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
  }, [connectorClient, publicClient, safeAddress]);

  const context: SafeContextShape = {
    connected: !!connectorClient,
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
