import onRampABI from "@/abi/OnRamp";
import { wagmiConfig } from "@/config/wagmi";
import { QueryKey } from "@/lib/constants";
import { getCustomSafeTxServiceUrl } from "@/lib/utils";
import SafeApiKit from "@safe-global/api-kit";
import { useQuery, type QueryFunction } from "@tanstack/react-query";
import { useCallback } from "react";
import { isAddress, type Address } from "viem";
import { useChainId, type UseChainIdReturnType } from "wagmi";
import { readContracts } from "wagmi/actions";

type ChainId = UseChainIdReturnType<NonNullable<typeof wagmiConfig>>;

interface RoleAccess {
  address: string;
  isSafe: boolean;
}

type GetRoleAccessParameters = {
  accountAddress: Address;
  roleMemebers: readonly Address[];
  safes: string[];
};

export type UseOnRampAccountAccessParameters = {
  onRampContractAddress: Address;
  accountAddress: Address | undefined;
};
export type UseOnRampAccountAccessQueryKey = [
  QueryKey.ACCOUNT_ON_RAMP_ACCESS,
  ChainId,
  Address,
  Address | undefined,
];
export type UseOnRampAccountAccessReturnType = {
  contractAddress: Address;
  accountAddress: Address | undefined;
  manager: RoleAccess | null;
  allocator: RoleAccess | null;
};

type UseOnRampAccountAccessQueryFn = QueryFunction<
  UseOnRampAccountAccessReturnType,
  UseOnRampAccountAccessQueryKey
>;

function createEmptyAccountState(
  contractAddress: Address
): UseOnRampAccountAccessReturnType {
  return {
    contractAddress,
    accountAddress: undefined,
    manager: null,
    allocator: null,
  };
}

export function useOnRampAccessControlForAccount({
  onRampContractAddress,
  accountAddress,
}: UseOnRampAccountAccessParameters) {
  const chainId = useChainId<NonNullable<typeof wagmiConfig>>();

  const queryFn = useCallback<UseOnRampAccountAccessQueryFn>(
    async ({ queryKey }) => {
      if (!wagmiConfig) {
        throw new Error("Wagmi config not found");
      }

      const [, chainId, contractAddress, accountAddress] = queryKey;

      const onRampContract = {
        address: contractAddress,
        abi: onRampABI,
      } as const;

      if (!accountAddress) {
        return createEmptyAccountState(contractAddress);
      }

      const [managerRole, allocatorRole] = await readContracts(wagmiConfig, {
        allowFailure: false,
        contracts: [
          {
            ...onRampContract,
            functionName: "MANAGER_ROLE",
          },
          {
            ...onRampContract,
            functionName: "ALLOCATOR_ROLE",
          },
        ],
      });

      const safeKit = new SafeApiKit({
        chainId: BigInt(chainId),
        txServiceUrl: getCustomSafeTxServiceUrl(chainId),
      });

      const [{ safes }, [managers, allocators]] = await Promise.all([
        safeKit.getSafesByOwner(accountAddress),
        readContracts(wagmiConfig, {
          allowFailure: false,
          contracts: [
            {
              ...onRampContract,
              functionName: "getRoleMembers",
              args: [managerRole],
            },
            {
              ...onRampContract,
              functionName: "getRoleMembers",
              args: [allocatorRole],
            },
          ],
        }),
      ]);

      return {
        accountAddress,
        contractAddress,
        manager: getRoleAccess({
          accountAddress,
          safes,
          roleMemebers: managers,
        }),
        allocator: getRoleAccess({
          accountAddress,
          safes,
          roleMemebers: allocators,
        }),
      };
    },
    []
  );

  return useQuery({
    queryFn,
    queryKey: [
      QueryKey.ACCOUNT_ON_RAMP_ACCESS,
      chainId,
      onRampContractAddress,
      accountAddress,
    ],
  });
}

function getRoleAccess({
  accountAddress,
  roleMemebers,
  safes,
}: GetRoleAccessParameters): RoleAccess | null {
  if (roleMemebers.includes(accountAddress)) {
    return {
      address: accountAddress,
      isSafe: false,
    };
  }

  const maybeSafeAddress = safes.find(
    (safeAddress) =>
      isAddress(safeAddress) && roleMemebers.includes(safeAddress)
  ) as Address | undefined;

  return maybeSafeAddress
    ? {
        address: maybeSafeAddress,
        isSafe: true,
      }
    : null;
}
