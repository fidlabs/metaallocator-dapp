import Providers from "@/components/Providers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { PropsWithChildren } from "react";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <header className="container mx-auto py-3 flex justify-between items-center gap-6 mb-12">
        <h1 className="text-xl font-semibold">
          <Link className="hover:underline" href="/">
            Metaallocator dApp
          </Link>
          <sup className="text-sm font-normal text-muted-foreground">BETA</sup>
        </h1>
        <ConnectButton />
      </header>
      {children}
    </Providers>
  );
}

export default AppLayout;
