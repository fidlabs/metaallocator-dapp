import bytes from "bytes-iec";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { filecoin, filecoinCalibration } from "wagmi/chains";

interface ShortenAddressOptions {
  leading?: number;
  trailing?: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCustomSafeTxServiceUrl(chainId: number): string | undefined {
  switch (chainId) {
    case filecoin.id:
      return "https://transaction.safe.filecoin.io/api";
    case filecoinCalibration.id:
      return "https://transaction-testnet.safe.filecoin.io/api";
  }
}

export function formatBytes(input: bigint | number): string {
  if (
    typeof input === "bigint" &&
    (input > Number.MAX_SAFE_INTEGER || input < Number.MIN_SAFE_INTEGER)
  ) {
    throw new Error("Input out of range");
  }

  return bytes.format(Number(input), { mode: "binary" }) ?? "";
}

export async function poll<Result>(
  fn: () => Promise<Result>,
  fnCondition: (result: Result) => boolean,
  ms = 1000
) {
  const result = await fn();

  if (fnCondition(result)) {
    await wait(ms);
    return poll(fn, fnCondition, ms);
  }

  return result;
}

export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function shortenAddress(
  address: string,
  options: ShortenAddressOptions = {}
): string {
  const { leading = 4, trailing = 4 } = options;

  return address.slice(0, leading) + "..." + address.slice(-trailing);
}
