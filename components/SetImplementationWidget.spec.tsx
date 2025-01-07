import factoryABI from "@/abi/Factory";
import { renderWithSafeContext } from "@/lib/test-utils";
import { cleanup, fireEvent } from "@testing-library/react";
import { toast } from "sonner";
import { Address, encodeFunctionData } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoaderButton from "./LoaderButton";
import SetImplementationWidget from "./SetImplementationWidget";
import * as TransactionButtonComponents from "./TransactionButton";

vi.mock("sonner");

describe("SetImplementationWidget component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("allows setting new implementation for factory", () => {
    const testFactoryAddress: Address =
      "0x0000000000000000000000000000000000000001";
    const testImplementationAddress: Address =
      "0x0000000000000000000000000000000000000002";

    const TransactionButtonSpy = vi
      .spyOn(TransactionButtonComponents, "default")
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

    const { getByRole, getByPlaceholderText } = renderWithSafeContext(
      <SetImplementationWidget contractAddress={testFactoryAddress} />,
      {
        deployed: true,
        initialized: true,
        connected: true,
      }
    );

    const button = getByRole("button", { name: "Change" });
    const input = getByPlaceholderText("New implementatation address");

    // Button initially disabled until owner address is entered
    expect(button).toBeDisabled();

    // Button is enabled after entering implementation address and correct transaction is passed
    fireEvent.change(input, { target: { value: testImplementationAddress } });
    expect(button).toBeEnabled();
    expect(TransactionButtonSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        transaction: {
          to: testFactoryAddress,
          data: encodeFunctionData({
            abi: factoryABI,
            functionName: "setImplementation",
            args: [testImplementationAddress],
          }),
          value: "0",
        },
      }),
      expect.anything()
    );

    // State is cleared after deployment and toast is displayed
    fireEvent.click(button);
    expect(input).toHaveValue("");
    expect(button).toBeDisabled();
    expect(toast).toHaveBeenCalledWith("Factory implementation was changed");
  });
});
