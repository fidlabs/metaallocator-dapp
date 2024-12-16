import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCustomSafeTxServiceUrl(chainId: number): string | undefined {
  if (chainId === 314_159) {
    return "https://transaction-testnet.staging.safe.filecoin.io/api";
  }
}
