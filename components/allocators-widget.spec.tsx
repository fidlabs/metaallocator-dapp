import * as useAllocatorsWithAllowanceHooks from "@/hooks/use-allocators-with-allowance";
import { cleanup, getAllByRole, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as AllocatorsTableRow from "./AllocatorsTableRow";
import AllocatorsWidget from "./allocators-widget";
import { TableCell, TableRow } from "./ui/table";

const testContractAddress = "0x0";

const AllocatorsTableRowSpy = vi
  .spyOn(AllocatorsTableRow, "default")
  .mockImplementation(
    ({
      allocatorAddress,
      allocatorAllowance,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      allocatorContractAddress,
      ...rest
    }) => (
      <TableRow {...rest}>
        <TableCell>{allocatorAddress}</TableCell>
        <TableCell>f0123</TableCell>
        <TableCell>{allocatorAllowance.toString()}</TableCell>
        <TableCell></TableCell>
      </TableRow>
    )
  );

const useAllocatorsWithAllowanceSpy = vi.spyOn(
  useAllocatorsWithAllowanceHooks,
  "useAllocatorsWithAllowance"
);

describe("AllocatorsWidget component", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("displays a table with list of allocators", () => {
    const mockAllocatorsMap = {
      "0x0000000000000000000000000000000000000001": 0n,
      "0x0000000000000000000000000000000000000002": 100n,
      "0x0000000000000000000000000000000000000003": 1000n,
    } as const;

    useAllocatorsWithAllowanceSpy.mockImplementation(() => {
      return {
        data: mockAllocatorsMap,
        error: null,
        isLoading: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // we mock as much as we need here
    });

    const { getByRole } = render(
      <AllocatorsWidget allocatorContractAddress={testContractAddress} />
    );
    const table = getByRole("table");
    const columnHeaders = getAllByRole(table, "columnheader");

    expect(columnHeaders.length).toBe(4);
    expect(AllocatorsTableRowSpy).toHaveBeenCalledTimes(2);
    const [, ...nonZeroAllowanceAllocators] = Object.entries(mockAllocatorsMap);

    nonZeroAllowanceAllocators.forEach(
      ([mockAllocatorAddress, mockAllocatorAllowance], index) => {
        expect(AllocatorsTableRowSpy).toHaveBeenNthCalledWith(
          index + 1,
          expect.objectContaining({
            allocatorAddress: mockAllocatorAddress,
            allocatorAllowance: mockAllocatorAllowance,
            allocatorContractAddress: testContractAddress,
          }),
          undefined
        );
      }
    );
  });

  it("displays empty state when no allocator were found", () => {
    useAllocatorsWithAllowanceSpy.mockImplementation(() => {
      return {
        data: {},
        error: undefined,
        isLoading: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // we mock as much as we need here
    });

    const { queryByRole, queryByText } = render(
      <AllocatorsWidget allocatorContractAddress={testContractAddress} />
    );
    const table = queryByRole("table");
    expect(table).toBe(null);
    expect(AllocatorsTableRowSpy).toHaveBeenCalledTimes(0);

    expect(queryByText("No allocators found.")).not.toBe(null);
  });
});
