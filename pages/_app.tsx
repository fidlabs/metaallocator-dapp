import Providers from "@/components/Providers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Montserrat } from "next/font/google";
import { useIsomorphicLayoutEffect } from "usehooks-ts";
import { cn } from "@/lib/utils";
import Head from "next/head";

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
        <div className="container mx-auto py-3">
          <ConnectButton />
        </div>
        <Component {...pageProps} />
      </Providers>
    </>
  );
}
