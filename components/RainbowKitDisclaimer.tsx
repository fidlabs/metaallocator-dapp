import Link from "next/link";
import { Button } from "./ui/button";

export function RainbowKitDisclaimer() {
  return (
    <p className="text-sm text-muted-foreground">
      If you want to use Ledger please follow the instructions{" "}
      <Button asChild variant="link">
        <Link
          href="https://github.com/fidlabs/metaallocator-dapp/blob/main/docs/connect-ledger.md"
          target="_blank"
        >
          here
        </Link>
      </Button>
      .
    </p>
  );
}
