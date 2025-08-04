"use client";

import { useStoredState } from "@/hooks/use-stored-state";
import {
  FilecoinAddress,
  isFilecoinAddress,
  isPlainObject,
} from "@/types/common";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@fidlabs/common-react-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "lucide-react";
import { MouseEventHandler, useCallback, useMemo, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Address as EVMAddress, isAddress } from "viem";
import { z } from "zod";

type Address = EVMAddress | FilecoinAddress;
type Name = string | null;
type AddressList = Record<Address, Name>;
type AddressNameTuple = [Address, Name];

export interface AddressBookProps {
  heading: ReactNode;
  storageKey: string;
  onSelectAddress(address: Address): void;
}

const addressFormSchema = z.object({
  address: z.string().refine<string>((value) => {
    return isAddress(value) || isFilecoinAddress(value);
  }, "Invalid address"),
  name: z.string(),
});

export function AddressBook({
  heading,
  storageKey,
  onSelectAddress,
}: AddressBookProps) {
  const [storedAddresses, setStoredAddresses] = useStoredState(storageKey);
  const addressListEntries = useMemo(() => {
    const addressList = safeParseStoredAddresses(storedAddresses);
    return Object.entries(addressList) as AddressNameTuple[];
  }, [storedAddresses]);

  const addressForm = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address: "",
      name: "",
    },
  });

  const { reset: resetAddressForm } = addressForm;

  const handleAddressFormSubmit = useCallback(
    (values: z.infer<typeof addressFormSchema>) => {
      const currentAddressList = safeParseStoredAddresses(storedAddresses);
      const nextAddressList = {
        ...currentAddressList,
        [values.address]: values.name === "" ? null : values.name,
      };

      setStoredAddresses(JSON.stringify(nextAddressList));
      resetAddressForm();
    },
    [resetAddressForm, setStoredAddresses, storedAddresses]
  );

  const handleRemoveAddress = useCallback(
    (address: Address) => {
      const addressList = safeParseStoredAddresses(storedAddresses);
      delete addressList[address]; // Mutable but simplest way to do it, just be careful :)
      setStoredAddresses(JSON.stringify(addressList));
    },
    [setStoredAddresses, storedAddresses]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
      </CardHeader>
      <Form {...addressForm}>
        <form
          className="p-6 border-t border-b grid gap-2"
          onSubmit={addressForm.handleSubmit(handleAddressFormSubmit)}
        >
          <FormField
            control={addressForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <Input placeholder="Address" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addressForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Input placeholder="Name (optional)" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Add Address</Button>
        </form>
      </Form>

      {addressListEntries.length === 0 && (
        <div className="p-6 flex flex-col items-center">
          <p className="text-muted-foreground text-center">
            No stored entries found.
          </p>
        </div>
      )}

      {addressListEntries.length > 0 && (
        <ul className="py-3">
          {addressListEntries.map(([address, name]) => (
            <AddressListItem
              key={address}
              address={address}
              name={name}
              onSelectAddress={onSelectAddress}
              onRemoveAddress={handleRemoveAddress}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}

interface AddressListItemProps {
  address: Address;
  name: Name;
  onSelectAddress(address: Address): void;
  onRemoveAddress(address: Address): void;
}

function AddressListItem({
  address,
  name,
  onSelectAddress,
  onRemoveAddress,
}: AddressListItemProps) {
  const handleClick = useCallback(() => {
    onSelectAddress(address);
  }, [address, onSelectAddress]);

  const handleRemoveButtonClick = useCallback<MouseEventHandler>(
    (event) => {
      event.stopPropagation();
      onRemoveAddress(address);
    },
    [address, onRemoveAddress]
  );

  return (
    <li
      className="px-6 py-3 even:bg-gray-100/50 hover:bg-gray-100 cursor-pointer flex justify-between"
      onClick={handleClick}
    >
      <div>
        <h5 className="text-lg">{name ?? address}</h5>
        {name !== null && (
          <p className="text-xs text-muted-foreground">{address}</p>
        )}
      </div>

      <Button
        className="rounded-full group gap-0"
        onClick={handleRemoveButtonClick}
      >
        <span className="w-0 group-hover:w-[72px] transition-all overflow-hidden">
          Remove
        </span>
        <TrashIcon className="w-4 h-4" />
      </Button>
    </li>
  );
}

function safeParseStoredAddresses(storedAddresses: string | null): AddressList {
  if (storedAddresses === null) {
    return {};
  }

  try {
    const parsed = JSON.parse(storedAddresses);

    if (!isPlainObject(parsed)) {
      return {};
    }

    const validEntries = Object.entries(parsed).filter(
      (entry): entry is AddressNameTuple => {
        const addressValid = isAddress(entry[0]) || isFilecoinAddress(entry[0]);
        const nameValid = entry[0] === null || typeof entry[0] === "string";

        return addressValid && nameValid;
      }
    );

    return Object.fromEntries(validEntries);
  } catch {
    return {};
  }
}
