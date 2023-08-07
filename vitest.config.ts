/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["./tests/**/*.spec.ts", "./tests/**/*.test.ts"],
  },
});
