"use client";

import useFactoryContracts from "@/hooks/useFactoryContracts";
import Link from "next/link";
import type { Address } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface FactoryContractsWidgetProps {
  factoryAddress: Address;
}

export function FactoryContractsWidget({
  factoryAddress,
}: FactoryContractsWidgetProps) {
  const {
    data: contracts,
    error,
    isLoading,
  } = useFactoryContracts(factoryAddress);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-primary font-semibold">
          Contract deployed via Factory
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
              <ul>
                {contracts.map((contractAddress) => (
                  <li className="py-1" key={contractAddress}>
                    {contractAddress}{" "}
                    <Link
                      className="underline text-dodger-blue"
                      href={`/allocator/${contractAddress}`}
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
