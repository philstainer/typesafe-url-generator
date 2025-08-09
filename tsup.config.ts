import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  entryPoints: ["src/index.ts"],
  clean: true,
  dts: true,
  splitting: true,
  treeshake: true,
});
