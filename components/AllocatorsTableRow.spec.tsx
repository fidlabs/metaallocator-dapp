import allocatorABI from "@/abi/Allocator";
import { cleanup, fireEvent, getByRole, render } from "@testing-library/react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import AllocatorsTableRow from "./AllocatorsTableRow";
import LoaderButton from "./LoaderButton";
import * as TransactionButton from "./TransactionButton";

const testContractAddress = "0x1";
const testAllocatorAddress = "0x9e8258ede5e00E7DffB9F35BBF4001DF98B6cE23";

vi.mock("sonner");

describe("AllocatorsTableRow component", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("displays allocator with it's allowance and allows to reset it", () => {
    const TransactionButtonSpy = vi
      .spyOn(TransactionButton, "default")
      .mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ children, disabled, transaction, onSuccess, onError, ...rest }) => {
          return (
            <LoaderButton
              {...rest}
              onClick={() => onSuccess?.()}
              disabled={disabled || !transaction}
            >
              {children}
            </LoaderButton>
          );
        }
      );

    const { getAllByRole } = render(
      <table>
        <tbody>
          <AllocatorsTableRow
            allocatorContractAddress={testContractAddress}
            allocatorAddress={testAllocatorAddress}
            allocatorAllowance={107_374_182_400n}
          />
        </tbody>
      </table>
    );

    const cells = getAllByRole("cell");
    expect(cells.length).toBe(3);

    const [addressCell, allowanceCell, actionsCell] = cells;

    expect(addressCell).toHaveTextContent(testAllocatorAddress);
    expect(allowanceCell).toHaveTextContent("100 GiB");
    expect(TransactionButtonSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        transaction: {
          to: testContractAddress,
          data: encodeFunctionData({
            abi: allocatorABI,
            functionName: "setAllowance",
            args: [testAllocatorAddress, 0n],
          }),
          value: "0",
        },
      }),
      undefined
    );

    const resetButton = getByRole(actionsCell, "button", {
      name: "Reset Allowance",
    });

    fireEvent.click(resetButton);
    expect(toast).toHaveBeenCalledWith("Allowance was reset");
  });
});
