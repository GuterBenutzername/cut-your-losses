/* eslint-disable spaced-comment */
/* eslint-disable import/no-anonymous-default-export */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

/// <reference types="vitest" />

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {},
});
