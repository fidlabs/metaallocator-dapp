"use client";

import useFactoryContracts from "@/hooks/useFactoryContracts";
import Link from "next/link";
import type { Address } from "viem";
import { useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface FactoryContractsWidgetProps {
  factoryAddress: Address;
}

export function FactoryContractsWidget({
  factoryAddress,
}: FactoryContractsWidgetProps) {
  const chainId = useChainId();
  const {
    data: contracts,
    error,
    isLoading,
  } = useFactoryContracts(factoryAddress);

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
                {contracts.map((contractAddress) => (
                  <li
                    className="flex justify-between items-center gap-4 odd:bg-gray-100 px-6 py-4"
                    key={contractAddress}
                  >
                    <p>{contractAddress}</p>
                    <Link
                      className="underline text-dodger-blue"
                      href={`/allocator/${chainId}/${contractAddress}`}
                    >
                      View Details
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default FactoryContractsWidget;
