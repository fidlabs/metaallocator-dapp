"use client";

import factoryABI from "@/abi/Factory";
import { useReadContract } from "wagmi";

function useContractsList() {
  return useReadContract({
    abi: factoryABI,
    // address: "0xe7731ad9495d40ed6e0d5fdabac92691f1d81d7c", // Filecoin testnet
    address: "0x2Eb2f951592b166b8A961c89C9e1CaC5515Cff7D", // Sepolia
    functionName: "getContracts",
  });
}

export function ContractsList() {
  const { data, error, isLoading } = useContractsList();

  return (
    <div>
      {isLoading && <p>Loading contracts list</p>}
      {!!error && <p>An error occured: {error.message}</p>}
      {!!data && (
        <>
          {data.length > 0 && (
            <ul>
              {data.map((contractAddress) => (
                <li key={contractAddress}>{contractAddress}</li>
              ))}
            </ul>
          )}

          {data.length === 0 && <p>No deployed contracts</p>}
        </>
      )}
    </div>
  );
}

export default ContractsList;
