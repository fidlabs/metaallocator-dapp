import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BinaryBytesField from "./BinaryBytesField";

describe("BinaryBytesField component", () => {
  afterEach(cleanup);

  it("renders an input and triggers a callback on change", () => {
    const changeCallback = vi.fn();
    const { getByRole } = render(
      <BinaryBytesField onValueChange={changeCallback} />
    );

    const input = getByRole("textbox");

    fireEvent.change(input, { target: { value: "123" } });
    expect(changeCallback).toHaveBeenLastCalledWith(123n);

    fireEvent.change(input, { target: { value: "" } });
    expect(changeCallback).toHaveBeenLastCalledWith(null);
  });

  it.each([
    ["kiB", 102_400n],
    ["MiB", 104_857_600n],
    ["GiB", 107_374_182_400n],
    ["TiB", 109_951_162_777_600n],
    ["PiB", 112_589_990_684_262_400n],
    ["EiB", 115_292_150_460_684_697_600n],
  ])("allows changing unit to %s", (unit, value) => {
    const changeCallback = vi.fn();
    const { getByRole } = render(
      <BinaryBytesField onValueChange={changeCallback} value={100n} />
    );

    const trigger = getByRole("button");
    fireEvent.click(trigger);
    const unitButton = getByRole("option", {
      name: unit,
    });

    fireEvent.click(unitButton);
    expect(trigger.textContent?.trim()).toBe(unit);
    expect(changeCallback).toHaveBeenLastCalledWith(value);
  });
});
