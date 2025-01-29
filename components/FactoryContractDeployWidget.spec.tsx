import { renderWithSafeContext } from "@/lib/test-utils";
import { cleanup, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import FactoryContractDeployWidget from "./FactoryContractDeployWidget";
import { Address, encodeFunctionData } from "viem";
import * as RegularTransactionButtonComponents from "./RegularTransactionButton";
import LoaderButton from "./LoaderButton";
import { toast } from "sonner";
import factoryABI from "@/abi/Factory";

vi.mock("sonner");

describe("FactoryContractDeployWidget component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("allows deploying new contract via factory", () => {
    const testFactoryAddress: Address =
      "0x0000000000000000000000000000000000000001";
    const testOwnerAddress: Address =
      "0x0000000000000000000000000000000000000002";

    const TransactionButtonSpy = vi
      .spyOn(RegularTransactionButtonComponents, "default")
      .mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ children, disabled, transaction, onSuccess, onError, ...rest }) => {
          return (
            <LoaderButton
              {...rest}
              onClick={() => onSuccess?.("0x0")}
              disabled={disabled || !transaction}
            >
              {children}
            </LoaderButton>
          );
        }
      );

    const { getByRole, getByPlaceholderText } = renderWithSafeContext(
      <FactoryContractDeployWidget factoryAddress={testFactoryAddress} />,
      {
        deployed: true,
        initialized: true,
        connected: true,
      }
    );

    const button = getByRole("button", { name: "Deploy" });
    const input = getByPlaceholderText("Initial Owner Address");

    // Button initially disabled until owner address is entered
    expect(button).toBeDisabled();

    // Button is enabled after entering owner address and correct transaction is passed
    fireEvent.change(input, { target: { value: testOwnerAddress } });
    expect(button).toBeEnabled();
    expect(TransactionButtonSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        transaction: {
          to: testFactoryAddress,
          data: encodeFunctionData({
            abi: factoryABI,
            functionName: "deploy",
            args: [testOwnerAddress],
          }),
          value: "0",
        },
      }),
      undefined
    );

    // State is cleared after deployment and toast is displayed
    fireEvent.click(button);
    expect(input).toHaveValue("");
    expect(button).toBeDisabled();
    expect(toast.success).toHaveBeenCalledWith("Contract was deployed");
  });
});
