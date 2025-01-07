import { renderWithSafeContext } from "@/lib/test-utils";
import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TransactionButton, { TransactionButtonProps } from "./TransactionButton";

const connectWalletButtonLabel = "Connect Wallet";
const loaderButtonLabel = "Loading";
const safeTransactionButtonLabel = "Make safe transaction";
const regularTransactionButtonLabel = "Make regular transaction";

vi.mock("@/components/FallbackConnectWalletButton", () => ({
  default: () => <button>{connectWalletButtonLabel}</button>,
}));

vi.mock("@/components/LoaderButton", () => ({
  default: () => <button>{loaderButtonLabel}</button>,
}));

vi.mock("@/components/SafeTransactionButton", () => ({
  default: () => <button>{safeTransactionButtonLabel}</button>,
}));

vi.mock("@/components/RegularTransactionButton", () => ({
  default: () => <button>{regularTransactionButtonLabel}</button>,
}));

const sampleTransaction: NonNullable<TransactionButtonProps["transaction"]> = {
  to: "0x0",
  data: "0x0",
  value: "0",
};

describe("TransactionButtonComponent", () => {
  afterEach(cleanup);

  it("renders connect button when no wallet is connected", () => {
    const { queryByRole } = renderWithSafeContext(
      <TransactionButton transaction={sampleTransaction} />,
      {
        deployed: true,
        initialized: true,
        connected: false,
      }
    );

    const expectedButton = queryByRole("button", {
      name: connectWalletButtonLabel,
    });

    expect(expectedButton).not.toBe(null);
  });

  it("renders loader button when safe is not initialized", () => {
    const { queryByRole } = renderWithSafeContext(
      <TransactionButton transaction={sampleTransaction} />,
      {
        initialized: false,
      }
    );

    const expectedButton = queryByRole("button", {
      name: loaderButtonLabel,
    });

    expect(expectedButton).not.toBe(null);
  });

  it("renders regular transaction button when safe is not deployed", () => {
    const { queryByRole } = renderWithSafeContext(
      <TransactionButton transaction={sampleTransaction} />,
      {
        initialized: true,
        connected: true,
        deployed: false,
      }
    );

    const expectedButton = queryByRole("button", {
      name: regularTransactionButtonLabel,
    });

    expect(expectedButton).not.toBe(null);
  });

  it("renders safe transaction button when safe is deployed", () => {
    const { queryByRole } = renderWithSafeContext(
      <TransactionButton transaction={sampleTransaction} />,
      {
        initialized: true,
        connected: true,
        deployed: true,
      }
    );

    const expectedButton = queryByRole("button", {
      name: safeTransactionButtonLabel,
    });

    expect(expectedButton).not.toBe(null);
  });
});
