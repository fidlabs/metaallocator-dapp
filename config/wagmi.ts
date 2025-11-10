import { WALLETCONNECT_PROJECT_ID } from "@/lib/constants";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { extractChain, type HttpTransportConfig } from "viem";
import { createConfig, http } from "wagmi";
import { Chain, filecoin, filecoinCalibration } from "wagmi/chains";
import contractsConfigMap from "./contracts";
import { filecoinDevnet } from "./chains";

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
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
  appInfo
);

const commonTransportConfig: HttpTransportConfig = {
  timeout: 60000,
};

const chains = Array.from(contractsConfigMap.keys())
  .filter((chainId) => contractsConfigMap.get(chainId) != null)
  .map((chainId) => {
    return extractChain({
      chains: [filecoin, filecoinCalibration, filecoinDevnet],
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
        [filecoin.id]: http(undefined, commonTransportConfig),
        [filecoinCalibration.id]: http(undefined, commonTransportConfig),
        [filecoinDevnet.id]: http(undefined, commonTransportConfig),
      },
      ssr: true,
    })
  : null;
