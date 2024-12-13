import SafeContext, { type SafeContextShape } from "@/components/SafeContext";
import { useContext } from "react";

export function useSafeContext(): SafeContextShape {
  return useContext(SafeContext);
}

export default useSafeContext;
