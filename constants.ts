import { isAddress, type Address } from "viem";

export enum QueryKey {
  SAFE_OWNERS = "safe_owners",
  SAFE_PENDING_TRANSACTIONS = "safe_pending_transactions",
}

export enum MutatationKey {
  CONFIRM_SAFE_TRANSACTION = "confirm_safe_transaction",
  EXECUTE_SAFE_TRANSACTION = "execute_safe_transaction",
  SEND_SAFE_TRANSACTION = "send_safe_transaction",
}

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const FILECOIN_FACTORY_ADDRESS = addressOrNull(
  process.env.NEXT_PUBLIC_FILECOIN_FACTORY_ADDRESS
);
export const FILECOIN_CALIBRATION_FACTORY_ADDRESS = addressOrNull(
  process.env.NEXT_PUBLIC_FILECOIN_CALIBRATION_FACTORY_ADDRESS
);

function addressOrNull(input: unknown): Address | null {
  if (typeof input !== "string") {
    return null;
  }

  return isAddress(input) ? input : null;
}
