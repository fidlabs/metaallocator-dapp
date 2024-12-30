import SafeContext, {
  initialSafeContext,
  SafeContextShape,
} from "@/components/SafeContext";
import { render } from "@testing-library/react";

type RenderParameters = Parameters<typeof render>;

export function renderWithSafeContext(
  ui: RenderParameters[0],
  safeContext: Partial<SafeContextShape>,
  options?: RenderParameters[1]
): ReturnType<typeof render> {
  return render(
    <SafeContext.Provider
      value={{
        ...initialSafeContext,
        ...safeContext,
      }}
    >
      {ui}
    </SafeContext.Provider>,
    options
  );
}
