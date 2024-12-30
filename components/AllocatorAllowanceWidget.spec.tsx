import { renderWithSafeContext } from "@/lib/test-utils";
import { encodeFunctionData, type Address } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import AllocatorAllowanceWidget from "./AllocatorAllowanceWidget";
import { cleanup, fireEvent } from "@testing-library/react";
import * as TransactionButton from "@/components/TransactionButton";
import { toast } from "sonner";
import allocatorABI from "@/abi/Allocator";
import LoaderButton from "./LoaderButton";

const allocatorContractAddress: Address = "0x1";
const testAllocatorAddress = "0x9e8258ede5e00E7DffB9F35BBF4001DF98B6cE23";

vi.mock("sonner");
const TransactionButtonSpy = vi
  .spyOn(TransactionButton, "default")
  .mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ children, disabled, transaction, onSuccess, onError, ...rest }) => {
      return (
        <LoaderButton
          {...rest}
          onClick={onSuccess}
          disabled={disabled || !transaction}
        >
          {children}
        </LoaderButton>
      );
    }
  );

describe("AllocatorAllowanceWidget component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders a form to change allocators allowance", () => {
    const testAllowanceAmount = 107_374_182_400n; // 100 GiB

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
    fireEvent.change(addressInput, { target: { value: testAllocatorAddress } });
    fireEvent.change(allowanceInput, {
      target: { value: "100" },
    });

    expect(TransactionButtonSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        transaction: {
          to: allocatorContractAddress,
          data: encodeFunctionData({
            abi: allocatorABI,
            functionName: "addAllowance",
            args: [testAllocatorAddress, testAllowanceAmount],
          }),
          value: "0",
        },
      }),
      expect.anything()
    );

    const button = getByRole("button", { name: "Add Allowance" });
    fireEvent.click(button);

    expect(addressInput.value).toBe("");
    expect(allowanceInput.value).toBe("");
    expect(toast).toHaveBeenLastCalledWith("Allowance was updated");
  });

  it("validates user input", () => {
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

    const button = getByRole("button", { name: "Add Allowance" });

    // Nothing entered
    expect(button).toBeDisabled();

    const inputs = getAllByRole("textbox") as HTMLInputElement[];
    const [addressInput, allowanceInput] = inputs;

    // Should be disabled when allowance entered but no address
    fireEvent.change(allowanceInput, {
      target: { value: "100" },
    });
    expect(button).toBeDisabled();

    // Should be disabled when allowance entered and an invalid address
    fireEvent.change(addressInput, { target: { value: "invalid_address" } });
    expect(button).toBeDisabled();

    // Should be enabled when allowance and valid address entered
    fireEvent.change(addressInput, { target: { value: testAllocatorAddress } });
    expect(button).not.toBeDisabled();

    // Should go back to disabled when allowance cleared
    fireEvent.change(allowanceInput, {
      target: { value: "" },
    });
    expect(button).toBeDisabled();
  });
});
