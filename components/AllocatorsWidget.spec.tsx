import * as useAllocatorsHooks from "@/hooks/useAllocators";
import { cleanup, getAllByRole, render } from "@testing-library/react";
import type { Address } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as AllocatorsTableRow from "./AllocatorsTableRow";
import AllocatorsWidget from "./AllocatorsWidget";
import { TableCell, TableRow } from "./ui/table";

const testContractAddress = "0x0";

const AllocatorsTableRowSpy = vi
  .spyOn(AllocatorsTableRow, "default")
  .mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ allocatorAddress, allocatorContractAddress, ...rest }) => (
      <TableRow {...rest}>
        <TableCell>{allocatorAddress}</TableCell>
        <TableCell>100GiB</TableCell>
        <TableCell></TableCell>
      </TableRow>
    )
  );

const useAllocatorsSpy = vi.spyOn(useAllocatorsHooks, "default");

describe("AllocatorsWidget component", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("displays a table with list of allocators", () => {
    const mockAllocatorsList: Address[] = ["0x1", "0x2"];

    useAllocatorsSpy.mockImplementation(() => {
      return {
        data: mockAllocatorsList,
        error: undefined,
        isLoading: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // we mock as much as we need here
    });

    const { getByRole } = render(
      <AllocatorsWidget allocatorContractAddress={testContractAddress} />
    );
    const table = getByRole("table");
    const columnHeaders = getAllByRole(table, "columnheader");

    expect(columnHeaders.length).toBe(3);
    expect(AllocatorsTableRowSpy).toHaveBeenCalledTimes(
      mockAllocatorsList.length
    );
    mockAllocatorsList.forEach((mockAllocatorAddress, index) => {
      expect(AllocatorsTableRowSpy).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          allocatorAddress: mockAllocatorAddress,
          allocatorContractAddress: testContractAddress,
        }),
        expect.anything()
      );
    });
  });

  it("displays empty state when no allocator were found", () => {
    useAllocatorsSpy.mockImplementation(() => {
      return {
        data: [],
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
