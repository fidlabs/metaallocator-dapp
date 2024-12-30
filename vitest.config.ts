import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.test.ts", "**/*.test.tsx"],
    environment: "jsdom",
    setupFiles: ["./tests/setup.tsx"],
  },
  resolve: {
    alias: {
      "@": __dirname,
    },
  },
});
