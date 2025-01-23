import { Toaster } from "@/components/ui/sonner";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { PropsWithChildren } from "react";
import "../styles/globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Metaallocator dApp",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className={montserrat.variable}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
