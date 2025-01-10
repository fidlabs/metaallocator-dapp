import {
  cleanup,
  getAllByRole,
  queryByRole,
  queryByText,
  render,
} from "@testing-library/react";
import { type Address } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import FactoryContractsWidget from "./FactoryContractsWidget";
import * as useFactoryContractHooks from "@/hooks/useFactoryContracts";

const testChainId: number = 1;
const testFactoryAddress: Address = "0x0";
const testContracts: Address[] = ["0x1", "0x2"];

vi.mock("wagmi", () => ({
  useChainId: vi.fn().mockImplementation(() => testChainId),
}));

const useFactoryContractSpy = vi.spyOn(useFactoryContractHooks, "default");

describe("FactoryContractsWidget component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("shows lists of deployed contracts", () => {
    useFactoryContractSpy.mockImplementationOnce(() => {
      return {
        isLoading: false,
        error: undefined,
        data: testContracts,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // mocking only what we need
    });

    const { getByRole } = render(
      <FactoryContractsWidget factoryAddress={testFactoryAddress} />
    );
    const list = getByRole("list");
    const listItems = getAllByRole(list, "listitem");

    expect(listItems.length).toBe(testContracts.length);

    testContracts.forEach((testContractAddress, index) => {
      const listItem = listItems[index];

      const addressText = queryByText(listItem, testContractAddress);
      expect(addressText).not.toBeNull();

      const link = queryByRole(listItem, "link", {
        name: "Manage",
      });
      expect(link).not.toBeNull();
      expect((link as HTMLAnchorElement).pathname).toBe(
        `/allocator/${testChainId}/${testContractAddress}`
      );
    });
  });

  it("shows empty state when no contracts are deployed", () => {
    useFactoryContractSpy.mockImplementationOnce(() => {
      return {
        isLoading: false,
        error: undefined,
        data: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // mocking only what we need
    });

    const { queryByText, queryByRole } = render(
      <FactoryContractsWidget factoryAddress={testFactoryAddress} />
    );

    const list = queryByRole("list");
    expect(list).toBeNull();

    const emptyStateText = queryByText(
      "No contracts were deployed via this factory."
    );
    expect(emptyStateText).not.toBeNull();
  });

  it("shows loading state when list of contracts is loading", () => {
    useFactoryContractSpy.mockImplementationOnce(() => {
      return {
        isLoading: true,
        error: undefined,
        data: undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // mocking only what we need
    });

    const { queryByText, queryByRole } = render(
      <FactoryContractsWidget factoryAddress={testFactoryAddress} />
    );

    const list = queryByRole("list");
    expect(list).toBeNull();

    const loadingStateText = queryByText("Loading deployed contracts list...");
    expect(loadingStateText).not.toBeNull();
  });

  it("shows an error state when loading list of contracts fails", () => {
    const testErrorMessage = "A test error occured";
    useFactoryContractSpy.mockImplementationOnce(() => {
      return {
        isLoading: false,
        error: new Error(testErrorMessage),
        data: undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // mocking only what we need
    });

    const { queryByText, queryByRole } = render(
      <FactoryContractsWidget factoryAddress={testFactoryAddress} />
    );

    const list = queryByRole("list");
    expect(list).toBeNull();

    const erorStateText = queryByText(
      `Error loading deployed contracts list: ${testErrorMessage}`
    );
    expect(erorStateText).not.toBeNull();
  });
});
