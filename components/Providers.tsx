"use client";

import { wagmiConfig } from "@/config/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitDisclaimer } from "./RainbowKitDisclaimer";

const client = new QueryClient();

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  if (!wagmiConfig) {
    return <p>Missing chains configuration.</p>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider
          modalSize="compact"
          appInfo={{
            disclaimer: RainbowKitDisclaimer,
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
