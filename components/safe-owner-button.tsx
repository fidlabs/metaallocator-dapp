import useSafeContext from "@/hooks/useSafeContext";
import useSafeOwners from "@/hooks/useSafeOwners";
import { useAccount } from "wagmi";
import LoaderButton, { LoaderButtonProps } from "./LoaderButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import FallbackConnectWalletButton from "./FallbackConnectWalletButton";

export type SafeOwnerButtonProps = LoaderButtonProps;

export function SafeOwnerButton({
  children,
  disabled,
  loading,
  ...rest
}: SafeOwnerButtonProps) {
  const { address: accountAddress } = useAccount();
  const { deployed, initialized, safeAddress } = useSafeContext();
  const { data: safeOwners = [], isLoading } = useSafeOwners(
    deployed ? safeAddress : undefined
  );
  const isOwner =
    !deployed || (!!accountAddress && safeOwners.includes(accountAddress));
  const showLoader = !initialized || isLoading;

  const buttonEl = accountAddress ? (
    <LoaderButton
      {...rest}
      disabled={disabled || !isOwner}
      loading={loading || showLoader}
    >
      {children}
    </LoaderButton>
  ) : (
    <FallbackConnectWalletButton {...rest} type="button" />
  );

  return !showLoader && !isOwner ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{buttonEl}</span>
        </TooltipTrigger>

        <TooltipContent>
          <p>Only Safe owners can perform this action.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    buttonEl
  );
}
