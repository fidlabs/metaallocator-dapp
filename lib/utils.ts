import { filesize } from "filesize";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import type { FilecoinAddress, FilecoinRPCSchema } from "@/types/common";
import {
  type Address,
  type Chain,
  createPublicClient,
  http,
  type HttpTransport,
} from "viem";

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
  return filesize(input, { standard: "iec" });
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

export function unknownToError(input: unknown): Error {
  return input instanceof Error ? input : new Error(String(input));
}

export function arrayUnique<T>(input: readonly T[]): T[] {
  return input.filter((item, index) => {
    return input.findIndex((candidate) => candidate === item) === index;
  });
}

function getChain(chainId: number): Chain | null {
  switch (chainId) {
    case filecoin.id:
      return filecoin;
    case filecoinCalibration.id:
      return filecoinCalibration;
    default:
      return null;
  }
}

export async function getEthAddressForChain(
  filecoinAddress: FilecoinAddress,
  chainId: number
): Promise<Address | null> {
  const chain = getChain(chainId);

  if (chain === null) {
    return null;
  }

  const publicClient = createPublicClient<
    HttpTransport,
    Chain,
    undefined,
    FilecoinRPCSchema
  >({
    chain,
    transport: http(),
  });

  const evmAddress = await publicClient.request({
    method: "Filecoin.FilecoinAddressToEthAddress",
    params: [filecoinAddress],
  });

  return evmAddress;
}
