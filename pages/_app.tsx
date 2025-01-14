import { Toaster } from "@/components/ui/sonner";
import { NextPageWithLayout } from "@/definitions/common-types";
import { cn } from "@/lib/utils";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import { useIsomorphicLayoutEffect } from "usehooks-ts";
import "../styles/globals.css";

const font = Montserrat({
  subsets: ["latin"],
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  useIsomorphicLayoutEffect(() => {
    document.body.style.setProperty("--font-family", font.style.fontFamily);
    document.body.className = cn(font.className, "antialiased");
  }, []);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Metaallocator dApp</title>
      </Head>

      {getLayout(<Component {...pageProps} />)}
      <Toaster />
    </>
  );
}
