interface WaitableTransaction {
  wait(): Promise<unknown>;
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
