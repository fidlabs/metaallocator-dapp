import allocatorABI from "@/abi/Allocator";
import * as useFilecoinAddressHooks from "@/hooks/use-filecoin-address";
import { cleanup, fireEvent, getByRole, render } from "@testing-library/react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { filecoin, filecoinCalibration } from "viem/chains";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as wagmi from "wagmi";
import AllocatorsTableRow from "./AllocatorsTableRow";
import LoaderButton from "./LoaderButton";
import * as TransactionButton from "./TransactionButton";

const testContractAddress = "0x1";
const testAllocatorAddress = "0x9e8258ede5e00E7DffB9F35BBF4001DF98B6cE23";
const testAllocatorFilecoinAddress = "f0123";

vi.mock("sonner");
vi.mock("wagmi");

const useChainIdSpy = vi.spyOn(wagmi, "useChainId");

const useFilecoinAddressSpy = vi.spyOn(
  useFilecoinAddressHooks,
  "useFilecoinAddress"
);

describe("AllocatorsTableRow component", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("displays allocator with it's allowance and allows to reset it", () => {
    useFilecoinAddressSpy.mockImplementation(() => {
      return {
        data: testAllocatorFilecoinAddress,
        error: null,
        isLoading: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // mocking only what we need
    });

    useChainIdSpy.mockImplementation(() => filecoin.id);

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

    const { getAllByRole, rerender } = render(
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

    expect(useFilecoinAddressSpy).toHaveBeenCalledWith({
      ethAddress: testAllocatorAddress,
      robust: true,
    });

    const cells = getAllByRole("cell");
    expect(cells.length).toBe(4);

    const [ethAddressCell, filecoinAddressCell, allowanceCell, actionsCell] =
      cells;
    const ethAddressLink: HTMLAnchorElement = getByRole(ethAddressCell, "link");
    const filecoinAddressLink: HTMLAnchorElement = getByRole(
      filecoinAddressCell,
      "link"
    );

    // Correct link to ETH explorer
    expect(ethAddressLink).toHaveTextContent("0x9e82...cE23");
    expect(ethAddressLink.href).toBe(
      `https://filfox.info/en/address/${testAllocatorAddress}`
    );

    // Correct link to Filecoin explorer
    expect(filecoinAddressLink).toHaveTextContent(testAllocatorFilecoinAddress);
    expect(filecoinAddressLink.href).toBe(
      `https://filfox.info/en/address/${testAllocatorFilecoinAddress}`
    );

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

    useChainIdSpy.mockImplementation(() => filecoinCalibration.id);

    rerender(
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

    // Correct link to ETH explorer on testnet
    expect(ethAddressLink.href).toBe(
      `https://calibration.filfox.info/en/address/${testAllocatorAddress}`
    );

    // Correct link to ETH explorer on testnet
    expect(filecoinAddressLink.href).toBe(
      `https://calibration.filfox.info/en/address/${testAllocatorFilecoinAddress}`
    );
  });
});
