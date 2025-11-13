import { defineChain } from "viem";

export const filecoinDevnet = defineChain({
  id: 31415926,
  name: "Filecoin Devnet",
  nativeCurrency: {
    decimals: 18,
    name: "devnet filecoin",
    symbol: "dFIL",
  },
  rpcUrls: {
    default: {
      http: ["/devnet-rpc", "http://fidlabs.servehttp.com:1234/rpc/v1"],
    },
  },
});
