import "@testing-library/jest-dom/vitest";
import ResizeObserver from "resize-observer-polyfill";
window.ResizeObserver = ResizeObserver;
window.HTMLElement.prototype.scrollIntoView = function () {};
