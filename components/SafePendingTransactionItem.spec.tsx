import ownable2StepABI from "@/abi/Ownable2Step";
import { cleanup, render } from "@testing-library/react";
import { type PropsWithChildren } from "react";
import { encodeFunctionData } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import SafePendingTransactionItem, {
  type SafePendingTransactionItemProps,
} from "./SafePendingTransactionItem";

type Tx = SafePendingTransactionItemProps<
  typeof ownable2StepABI
>["transaction"];

const testTransaction: Tx = {
  safe: "0x0",
  to: "0x1",
  value: "",
  operation: 0,
  gasToken: "",
  safeTxGas: 0,
  baseGas: 0,
  gasPrice: "",
  nonce: 0,
  executionDate: "",
  submissionDate: "",
  modified: "",
  transactionHash: "0x1",
  safeTxHash: "0x2",
  proposer: "",
  isExecuted: false,
  origin: "",
  confirmationsRequired: 2,
  trusted: false,
  confirmations: [
    {
      owner: "0x0",
      submissionDate: "",
      signature: "",
      signatureType: "CONTRACT_SIGNATURE",
    },
  ],
};

const testTransactionData = encodeFunctionData({
  abi: ownable2StepABI,
  functionName: "transferOwnership",
  args: ["0x0000000000000000000000000000000000000123"],
});

vi.mock("./ConfirmSafeTransactionButton", () => ({
  default: ({ children }: PropsWithChildren) => <button>{children}</button>,
}));

describe("SafePendingTransactionItem component", () => {
  afterEach(() => {
    cleanup();
  });

  it("displays correct transaction title when no target set", () => {
    const { queryByText } = render(
      <SafePendingTransactionItem
        index={1}
        transaction={{
          ...testTransaction,
          data: testTransactionData,
        }}
      />
    );

    expect(queryByText(testTransaction.safeTxHash)).toBeInTheDocument();
  });

  it("displays correct transaction title when target set", () => {
    const { queryByText } = render(
      <SafePendingTransactionItem
        index={1}
        transaction={{
          ...testTransaction,
          data: testTransactionData,
        }}
        target={{
          address: "0x0",
          abi: ownable2StepABI,
        }}
      />
    );

    expect(
      queryByText(
        `transferOwnership("0x0000000000000000000000000000000000000123")`
      )
    ).toBeInTheDocument();
  });

  it("displays correct transaction title when custom function is provided", () => {
    const { queryByText } = render(
      <SafePendingTransactionItem
        index={1}
        transaction={{
          ...testTransaction,
          data: testTransactionData,
        }}
        target={{
          address: "0x0",
          abi: ownable2StepABI,
          formatTransactionTitle: (decodedData) => {
            return `Custom title ${
              decodedData.functionName
            } ${decodedData.args.join(";")}`;
          },
        }}
      />
    );

    expect(
      queryByText(
        "Custom title transferOwnership 0x0000000000000000000000000000000000000123"
      )
    ).toBeInTheDocument();
  });

  it("displays number of confirmations", () => {
    const { queryByText } = render(
      <SafePendingTransactionItem index={1} transaction={testTransaction} />
    );

    expect(queryByText("1 out of 2 required")).toBeInTheDocument();
  });
});
