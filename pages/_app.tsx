import Providers from "@/components/Providers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Montserrat } from "next/font/google";
import { useIsomorphicLayoutEffect } from "usehooks-ts";
import { cn } from "@/lib/utils";
import Head from "next/head";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const font = Montserrat({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  useIsomorphicLayoutEffect(() => {
    document.body.style.setProperty("--font-family", font.style.fontFamily);
    document.body.className = cn(font.className, "antialiased");
  }, []);

  return (
    <>
      <Head>
        <title>Metaallocator dApp</title>
      </Head>
      <Providers>
        <header className="container mx-auto py-3 flex justify-between items-center gap-6 mb-12">
          <h1 className="text-xl font-semibold">
            <Link className="hover:underline" href="/">
              Metaallocator dApp
            </Link>
            <sup className="text-sm font-normal text-muted-foreground">
              BETA
            </sup>
          </h1>
          <ConnectButton />
        </header>
        <Component {...pageProps} />
      </Providers>
      <Toaster />
    </>
  );
}
