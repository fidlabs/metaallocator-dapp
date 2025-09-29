"use client";

import useFactoryContracts from "@/hooks/useFactoryContracts";
import Link from "next/link";
import type { Address } from "viem";
import { useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AllocatorDatacap } from "./AllocatorDatacap";
import { useStoredState } from "@/hooks/use-stored-state";
import { useCallback, useMemo, useState } from "react";
import { partition } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface FactoryContractsWidgetProps {
  factoryAddress: Address;
}

const hiddenEntriesStorageKey =
  "@fidlabs/contracts-admin/hidden-metaallocators";

export function FactoryContractsWidget({
  factoryAddress,
}: FactoryContractsWidgetProps) {
  const [hiddenEntriesJson, setHiddenEntriesJson] = useStoredState(
    hiddenEntriesStorageKey
  );
  const [showHiddenContracts, setShowHiddenContracts] = useState(false);
  const chainId = useChainId();
  const {
    data: contracts,
    error,
    isLoading,
  } = useFactoryContracts(factoryAddress);

  const hiddenEntries = useMemo(() => {
    if (hiddenEntriesJson === null) {
      return [];
    }

    try {
      const result = JSON.parse(hiddenEntriesJson);
      return Array.isArray(result) ? result : [];
    } catch {
      // Fail silently if we couldn't parse JSON
      return [];
    }
  }, [hiddenEntriesJson]);

  const [hiddenContracts, visibleContracts] = contracts
    ? partition(contracts, (contractAddress) => {
        return hiddenEntries.includes(contractAddress);
      })
    : [[], []];

  const shownContracts = showHiddenContracts
    ? [...visibleContracts, ...hiddenContracts]
    : visibleContracts;

  const handleVisibilityToggleButtonClick = useCallback(
    (contractAddress: Address) => {
      const foundIndex = hiddenEntries.findIndex(
        (entry) => entry === contractAddress
      );
      const nextHiddenEntries =
        foundIndex === -1
          ? [...hiddenEntries, contractAddress]
          : hiddenEntries.toSpliced(foundIndex, 1);
      setHiddenEntriesJson(JSON.stringify(nextHiddenEntries));
    },
    [hiddenEntries, setHiddenEntriesJson]
  );

  const handleToggleHiddenEntriesButtonClick = useCallback(() => {
    setShowHiddenContracts((currentValue) => !currentValue);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-primary font-semibold">
          Contracts Deployed via Factory
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <p className="text-sm text-muted-foreground text-center p-3">
            Loading deployed contracts list...
          </p>
        )}

        {!!error && (
          <p className="text-sm text-muted-foreground text-center p-3">
            Error loading deployed contracts list: {error.message}
          </p>
        )}

        {!isLoading && !error && !!contracts && (
          <>
            {contracts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center p-3">
                No contracts were deployed via this factory.
              </p>
            )}

            {contracts.length > 0 && (
              <ul className="-mx-6">
                {shownContracts.map((contractAddress) => (
                  <li
                    className="flex justify-between items-center gap-4 odd:bg-gray-200/20 px-6 py-4"
                    key={contractAddress}
                  >
                    <div>
                      <p className="text-md font-medium">{contractAddress}</p>
                      <p className="text-sm text-muted-foreground">
                        Datacap:{" "}
                        <AllocatorDatacap
                          allocatorContractAddress={contractAddress}
                        />
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild className="rounded-full">
                        <Link href={`/allocator/${chainId}/${contractAddress}`}>
                          Manage
                        </Link>
                      </Button>

                      <VisibilityToggleButton
                        contractAddress={contractAddress}
                        visible={!hiddenContracts.includes(contractAddress)}
                        onToggleVisibility={handleVisibilityToggleButtonClick}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {hiddenEntries.length > 0 && (
              <Button
                className="w-full text-muted-foreground"
                size="sm"
                variant="ghost"
                onClick={handleToggleHiddenEntriesButtonClick}
              >
                {showHiddenContracts ? "Hide" : "Show"} {hiddenEntries.length}{" "}
                hidden {hiddenEntries.length === 1 ? "entry" : "entries"}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default FactoryContractsWidget;

interface VisibilityToggleButtonProps {
  contractAddress: Address;
  visible: boolean;
  onToggleVisibility(contractAddress: Address): void;
}

function VisibilityToggleButton({
  contractAddress,
  visible,
  onToggleVisibility,
}: VisibilityToggleButtonProps) {
  const handleClick = useCallback(() => {
    onToggleVisibility(contractAddress);
  }, [contractAddress, onToggleVisibility]);

  return (
    <Button
      className="rounded-full group gap-0"
      variant="secondary"
      onClick={handleClick}
    >
      {visible ? (
        <EyeOffIcon className="w-4 h-4" />
      ) : (
        <EyeIcon className="w-4 h-4" />
      )}
      <span className="w-0 group-hover:w-[72px] transition-all overflow-hidden">
        {visible ? "Hide" : "Show"}
      </span>
    </Button>
  );
}
