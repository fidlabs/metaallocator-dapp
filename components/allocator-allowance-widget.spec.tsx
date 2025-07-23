import allocatorABI from "@/abi/Allocator";
import * as SafeOwnerButton from "@/components/safe-owner-button";
import * as useFilecoinPublicClientHooks from "@/hooks/use-filecoin-public-client";
import * as useMetaallocatorDatacapBreakdownHooks from "@/hooks/use-metaallocator-datacap-breakdown";
import * as useSendSafeContextTransactionHooks from "@/hooks/use-send-safe-context-transaction";
import { renderWithSafeContext } from "@/lib/test-utils";
import {
  cleanup,
  getByRole as getByRoleInContainer,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import AllocatorAllowanceWidget from "./allocator-allowance-widget";
import LoaderButton from "./LoaderButton";

const value100GiB = 107_374_182_400n;

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

vi.spyOn(
  useMetaallocatorDatacapBreakdownHooks,
  "useMetallocatorDatacapBreakdown"
).mockImplementation(() => {
  return {
    data: {
      contractDatacap: value100GiB,
      allocatedDatacap: 0n,
      unallocatedDatacap: value100GiB,
    },
    error: null,
    isLoading: false,
  };
});

describe("AllocatorAllowanceWidget component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders a form to increase allocators allowance", async () => {
    const user = userEvent.setup();
    const testAllowanceAmount = value100GiB;

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

    expect(allowanceInput.placeholder).toBe(
      "Enter allowance amount to be added"
    );

    await user.type(addressInput, testAllocatorFilecoinAddress);
    await user.type(allowanceInput, "100");

    const button = getByRole("button", { name: "Add Allowance" });
    await user.click(button);

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

  it("renders a form to decrease allocators allowance", async () => {
    const user = userEvent.setup();
    const testAllowanceAmount = value100GiB;

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

    const decreaseTab = getByRole("tab", { name: "Decrease" });
    await user.click(decreaseTab);

    const inputs = getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs.length).toBe(2);

    const [addressInput, allowanceInput] = inputs;

    expect(allowanceInput.placeholder).toBe(
      "Enter allowance amount to be removed"
    );

    await user.type(addressInput, testAllocatorFilecoinAddress);
    await user.type(allowanceInput, "100");

    const button = getByRole("button", { name: "Remove Allowance" });
    await user.click(button);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "Filecoin.FilecoinAddressToEthAddress",
      params: [testAllocatorFilecoinAddress],
    });

    expect(mockSendTransaction).toHaveBeenCalledWith({
      to: allocatorContractAddress,
      data: encodeFunctionData({
        abi: allocatorABI,
        functionName: "decreaseAllowance",
        args: [testAllocatorEthereumAddress, testAllowanceAmount],
      }),
      value: "0",
    });

    expect(addressInput.value).toBe("");
    expect(allowanceInput.value).toBe("");
    expect(toast.success).toHaveBeenLastCalledWith("Allowance was updated");
  });

  it("validates user input", async () => {
    const user = userEvent.setup();
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
    await user.click(button);

    expect(queryByText("Invalid allocator address")).toBeInTheDocument();
    expect(queryByText("Amount must be grater than 0")).toBeInTheDocument();
    expect(button).toBeDisabled();

    const inputs = getAllByRole("textbox") as HTMLInputElement[];
    const [addressInput, allowanceInput] = inputs;

    // Should be valid when correct values are entered
    await user.type(allowanceInput, "100");

    await user.type(addressInput, testAllocatorEthereumAddress);
    expect(button).not.toBeDisabled();

    // Should still be valid when address is changed to Filecoin format
    await user.clear(addressInput);
    await user.type(addressInput, testAllocatorFilecoinAddress);
    expect(button).not.toBeDisabled();

    // Should go back to disabled when allowance is cleared
    await user.clear(allowanceInput);
    expect(button).toBeDisabled();
  });

  it("renders a warning when allowance to be added exceeds unallocated datacap", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole, queryByRole } = renderWithSafeContext(
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
    const [, allowanceInput] = inputs;

    // Enter unallocated datacap as amount of allowance to be added
    await user.type(allowanceInput, "100");

    // No alert when amount to be added does not exceed unallocated datacap
    expect(queryByRole("alert")).toBeNull();

    // Increase amount to exceed unallocated datacap
    await user.clear(allowanceInput);
    await user.type(allowanceInput, "200");

    // Expect warning alert to render
    const alert = getByRole("alert");
    const alertHeading = getByRoleInContainer(alert, "heading");
    expect(alertHeading).toHaveTextContent("Warning!");
  });
});
