import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, ButtonProps } from "./ui/button";

export type FallbackConnectWalletButton = Omit<
  ButtonProps,
  "children" | "onClick"
>;

export function FallbackConnectWalletButton(
  props: FallbackConnectWalletButton
) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        authenticationStatus,
        chain,
        mounted,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        if (!connected) {
          return (
            <Button {...props} onClick={openConnectModal}>
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported) {
          return <Button onClick={openChainModal}>Wrong Network</Button>;
        }
      }}
    </ConnectButton.Custom>
  );
}

export default FallbackConnectWalletButton;
