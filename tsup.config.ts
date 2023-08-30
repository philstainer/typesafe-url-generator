import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entryPoints: ["src/index.ts"],
  clean: true,
  dts: true,
});
