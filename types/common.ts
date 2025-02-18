interface WaitableTransaction {
  wait(): Promise<unknown>;
}

export type FilecoinAddress =
  `${"f" | "t"}${"0" | "1" | "2" | "3" | "4"}${string}`;

const filecoinAddresRegex = /^[f|t]{1}[0-4]{1}[A-Za-z0-9]+$/;

export function isFilecoinAddress(input: unknown): input is FilecoinAddress {
  return typeof input === "string" && filecoinAddresRegex.test(input);
}

export function isWaitableTransaction(
  input: unknown
): input is WaitableTransaction {
  return (
    !!input &&
    typeof input === "object" &&
    !Array.isArray(input) &&
    typeof (input as any).wait === "function"
  );
}
