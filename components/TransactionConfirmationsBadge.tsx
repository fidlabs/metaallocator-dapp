import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import { Badge, BadgeProps } from "./ui/badge";

export interface TransactionConfirmationsBadgeProps
  extends Omit<BadgeProps, "children"> {
  confirmationsCount: number;
  confirmationsRequired: number;
}

export function TransactionConfirmationsBadge({
  className,
  confirmationsCount,
  confirmationsRequired,
  ...rest
}: TransactionConfirmationsBadgeProps) {
  return (
    <Badge {...rest} className={cn("gap-1", className)}>
      <UserIcon size={16} />
      {confirmationsCount} out of {confirmationsRequired} required
    </Badge>
  );
}

export default TransactionConfirmationsBadge;
