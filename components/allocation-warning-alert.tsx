import { Alert, AlertDescription, AlertTitle } from "@fidlabs/common-react-ui";
import { TriangleAlertIcon } from "lucide-react";

export function AllocationWarningAlert() {
  return (
    <Alert variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>Warning!</AlertTitle>
      <AlertDescription>
        You are trying to allocate more DataCap that is available on this
        Metallocator contract. Allocators may be unable to transfer DataCap to
        clients if there is none left on the contract even when granted
        allowance. Proceed with caution.
      </AlertDescription>
    </Alert>
  );
}
