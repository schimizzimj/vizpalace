/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["./src/**/__tests__/*.spec.ts", "./src/**/__tests__/*.test.ts"],
  },
});
