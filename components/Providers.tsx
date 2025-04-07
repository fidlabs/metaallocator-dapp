"use client";

import { wagmiConfig } from "@/config/wagmi";
import { APP_VERSION } from "@/lib/constants";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import type { ReactNode } from "react";
import { deserialize, serialize, WagmiProvider } from "wagmi";
import { RainbowKitDisclaimer } from "./RainbowKitDisclaimer";

const client = new QueryClient();
const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
  serialize,
  deserialize,
});

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  if (!wagmiConfig) {
    return <p>Missing chains configuration.</p>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <PersistQueryClientProvider
        client={client}
        persistOptions={{ persister, buster: APP_VERSION }}
      >
        <RainbowKitProvider
          modalSize="compact"
          appInfo={{
            disclaimer: RainbowKitDisclaimer,
          }}
        >
          {children}
        </RainbowKitProvider>
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
