import useSafeContext from "@/hooks/useSafeContext";
import type { ReactNode } from "react";

type FallbackComponent = () => ReactNode;
type Fallback = FallbackComponent | ReactNode | false;

export interface SafeGuardProps {
  children: ReactNode;
  notConnectedFallback?: Fallback;
  notDeployedFallback?: Fallback;
  notInitializedFallback?: Fallback;
}

export function SafeGuard({
  children,
  notConnectedFallback = false,
  notDeployedFallback = null,
  notInitializedFallback = null,
}: SafeGuardProps) {
  const { connected, deployed, initialized } = useSafeContext();

  if (!initialized && notInitializedFallback !== false) {
    return renderFallback(notInitializedFallback);
  }

  if (!deployed && notDeployedFallback !== false) {
    return renderFallback(notDeployedFallback);
  }

  if (!connected && notConnectedFallback !== false) {
    return renderFallback(notConnectedFallback);
  }

  return children;
}

function renderFallback(Fallback: Exclude<Fallback, false>): ReactNode {
  return typeof Fallback === "function" ? <Fallback /> : Fallback;
}

export default SafeGuard;
