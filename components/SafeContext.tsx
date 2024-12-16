"use client";

import type { SafeClient } from "@safe-global/sdk-starter-kit";
import { createContext } from "react";

export interface SafeContextShape {
  connected: boolean;
  initialized: boolean;
  deployed: boolean;
  safeAddress: string | undefined;
  publicSafeClient: SafeClient | undefined;
  signerSafeClient: SafeClient | undefined;
}

export const initialSafeContext: SafeContextShape = {
  connected: false,
  initialized: false,
  deployed: false,
  safeAddress: "0x",
  publicSafeClient: undefined,
  signerSafeClient: undefined,
};

export const SafeContext = createContext<SafeContextShape>(initialSafeContext);

export default SafeContext;
