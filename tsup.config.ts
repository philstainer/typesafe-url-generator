import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  entryPoints: ["src/index.ts", "src/generate-url.ts"],
  clean: true,
  dts: true,
  splitting: true,
  treeshake: true,
  minify: false,
});
