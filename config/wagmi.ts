import {
  FILECOIN_CALIBRATION_FACTORY_ADDRESS,
  FILECOIN_FACTORY_ADDRESS,
  WALLETCONNECT_PROJECT_ID,
} from "@/constants";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  ledgerWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { Chain, filecoin, filecoinCalibration } from "wagmi/chains";

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

export const wagmiConfig =
  FILECOIN_FACTORY_ADDRESS || FILECOIN_CALIBRATION_FACTORY_ADDRESS
    ? createConfig({
        connectors,
        chains: [
          FILECOIN_FACTORY_ADDRESS ? filecoin : undefined,
          FILECOIN_CALIBRATION_FACTORY_ADDRESS
            ? filecoinCalibration
            : undefined,
        ].filter((chain) => !!chain) as unknown as [Chain, ...Chain[]],
        transports: {
          [filecoin.id]: http(),
          [filecoinCalibration.id]: http(),
        },

        ssr: true,
      })
    : null;
