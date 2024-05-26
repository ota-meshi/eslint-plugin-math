import type { Options } from "tsup";

export default [
  {
    clean: true,
    dts: true,
    outDir: "lib",
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
  },
] satisfies Options[];
