import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

export interface LoaderButtonProps extends ButtonProps {
  loading?: boolean;
}

export function LoaderButton({
  children,
  disabled,
  loading = false,
  ...rest
}: LoaderButtonProps) {
  return (
    <Button {...rest} disabled={disabled || loading}>
      {children}
      {loading && <Loader2 className="animate-spin" />}
    </Button>
  );
}

export default LoaderButton;
