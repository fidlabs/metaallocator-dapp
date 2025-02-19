import allocatorABI from "@/abi/Allocator";
import * as SafeOwnerButton from "@/components/safe-owner-button";
import * as useFilecoinPublicClientHooks from "@/hooks/use-filecoin-public-client";
import * as useSendSafeContextTransactionHooks from "@/hooks/use-send-safe-context-transaction";
import { renderWithSafeContext } from "@/lib/test-utils";
import { cleanup, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import AllocatorAllowanceWidget from "./AllocatorAllowanceWidget";
import LoaderButton from "./LoaderButton";

const allocatorContractAddress: Address = "0x1";
const testAllocatorFilecoinAddress =
  "f410ft2bfr3pf4ahh375z6nn36qab36mlntrdpnza6ay";
const testAllocatorEthereumAddress =
  "0x9e8258ede5e00E7DffB9F35BBF4001DF98B6cE23";

vi.mock("sonner");
vi.spyOn(SafeOwnerButton, "SafeOwnerButton").mockImplementation(
  ({ children, ...rest }) => {
    return <LoaderButton {...rest}>{children}</LoaderButton>;
  }
);

const useSendSafeContextTransactionSpy = vi.spyOn(
  useSendSafeContextTransactionHooks,
  "useSendSafeContextTransaction"
);

const useFilecoinPublicClientSpy = vi
  .spyOn(useFilecoinPublicClientHooks, "useFilecoinPublicClient")
  .mockImplementation(() => {
    return {
      request: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any; // mocking only what we need;
  });

describe("AllocatorAllowanceWidget component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders a form to change allocators allowance", async () => {
    const testAllowanceAmount = 107_374_182_400n; // 100 GiB

    const mockSendTransaction = vi.fn();
    const mockRequest = vi.fn();

    useSendSafeContextTransactionSpy.mockImplementation((options) => {
      const { onSuccess } = options ?? {};

      return {
        sendTransaction: mockSendTransaction.mockImplementationOnce(() => {
          onSuccess?.("0x0");
        }),
        transactionInProgress: false,
      };
    });

    useFilecoinPublicClientSpy.mockImplementation(() => {
      return {
        request: mockRequest.mockImplementationOnce((input) => {
          if (input.method === "Filecoin.FilecoinAddressToEthAddress") {
            return testAllocatorEthereumAddress;
          }
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // mocking only what we need;
    });

    const { getByRole, getAllByRole } = renderWithSafeContext(
      <AllocatorAllowanceWidget
        allocatorContractAddress={allocatorContractAddress}
      />,
      {
        deployed: true,
        initialized: true,
        connected: true,
      }
    );

    const inputs = getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs.length).toBe(2);

    const [addressInput, allowanceInput] = inputs;

    await waitFor(() => {
      fireEvent.change(addressInput, {
        target: { value: testAllocatorFilecoinAddress },
      });
      fireEvent.change(allowanceInput, {
        target: { value: "100" },
      });

      const button = getByRole("button", { name: "Add Allowance" });
      fireEvent.click(button);
    });

    expect(mockRequest).toHaveBeenCalledWith({
      method: "Filecoin.FilecoinAddressToEthAddress",
      params: [testAllocatorFilecoinAddress],
    });

    expect(mockSendTransaction).toHaveBeenCalledWith({
      to: allocatorContractAddress,
      data: encodeFunctionData({
        abi: allocatorABI,
        functionName: "addAllowance",
        args: [testAllocatorEthereumAddress, testAllowanceAmount],
      }),
      value: "0",
    });

    expect(addressInput.value).toBe("");
    expect(allowanceInput.value).toBe("");
    expect(toast.success).toHaveBeenLastCalledWith("Allowance was updated");
  });

  it("validates user input", async () => {
    const { getByRole, getAllByRole, queryByText } = renderWithSafeContext(
      <AllocatorAllowanceWidget
        allocatorContractAddress={allocatorContractAddress}
      />,
      {
        deployed: true,
        initialized: true,
        connected: true,
      }
    );

    const button = getByRole("button", { name: "Add Allowance" });

    // Initial validation
    await waitFor(() => {
      fireEvent.click(button);
    });

    expect(queryByText("Invalid allocator address")).toBeInTheDocument();
    expect(queryByText("Amount must be grater than 0")).toBeInTheDocument();
    expect(button).toBeDisabled();

    const inputs = getAllByRole("textbox") as HTMLInputElement[];
    const [addressInput, allowanceInput] = inputs;

    // Should be valid when correct values are entered
    await waitFor(() => {
      fireEvent.change(allowanceInput, {
        target: { value: "100" },
      });

      fireEvent.change(addressInput, {
        target: { value: testAllocatorEthereumAddress },
      });
    });
    expect(button).not.toBeDisabled();

    // Should still be valid when address is changed to Filecoin format
    await waitFor(() => {
      fireEvent.change(addressInput, {
        target: { value: testAllocatorFilecoinAddress },
      });
    });
    expect(button).not.toBeDisabled();

    // Should go back to disabled when allowance is cleared
    await waitFor(() => {
      fireEvent.change(allowanceInput, {
        target: { value: "" },
      });
    });
    expect(button).toBeDisabled();
  });
});
