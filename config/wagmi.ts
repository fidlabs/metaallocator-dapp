import { WALLETCONNECT_PROJECT_ID } from "@/constants";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  ledgerWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { extractChain } from "viem";
import { createConfig, http } from "wagmi";
import { Chain, filecoin, filecoinCalibration } from "wagmi/chains";
import contractsConfigMap from "./contracts";

interface AppInfo {
  appName: string;
  projectId: string;
}

const appInfo: AppInfo = {
  appName: "Metaallocator dApp",
  projectId: WALLETCONNECT_PROJECT_ID ?? "", // Make sure it actually is set :)
};

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, ledgerWallet, walletConnectWallet],
    },
  ],
  appInfo
);

const chains = Array.from(contractsConfigMap.keys())
  .filter((chainId) => contractsConfigMap.get(chainId) != null)
  .map((chainId) => {
    return extractChain({
      chains: [filecoin, filecoinCalibration],
      id: chainId,
    });
  });

function isNotEmptyChainsList(input: Chain[]): input is [Chain, ...Chain[]] {
  return input.length > 0;
}

export const wagmiConfig = isNotEmptyChainsList(chains)
  ? createConfig({
      connectors,
      chains,
      transports: {
        [filecoin.id]: http(),
        [filecoinCalibration.id]: http(),
      },
      ssr: true,
    })
  : null;
