"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useChainId } from "wagmi";

export interface ChainWatcherProps {
  desiredChainId: number;
  redirectUrl?: string;
}

export function ChainWatcher({
  desiredChainId,
  redirectUrl = "",
}: ChainWatcherProps) {
  const { replace } = useRouter();
  const chainId = useChainId();

  useEffect(() => {
    if (
      !isNaN(desiredChainId) &&
      typeof chainId === "number" &&
      chainId !== desiredChainId
    ) {
      replace(redirectUrl);
    }
  }, [chainId, desiredChainId, redirectUrl, replace]);

  return null;
}

export default ChainWatcher;
