import Providers from "@/components/Providers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

interface Props {
  children: ReactNode;
}

const font = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metaallocator dApp",
  description:
    "Application for creating and interacting with metaallocator contracts",
};

function RootLayout({ children }: Props) {
  return (
    <html>
      <body className={`${font.className} antialiased`}>
        <Providers>
          <div className="container mx-auto py-3">
            <ConnectButton />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
