import type { Options } from "tsup";

export default [
  {
    clean: true,
    dts: true,
    outDir: "lib",
    entry: [
      "src/index.ts",
      "src/utils/type-checker/object-type-checker-for-ts.ts",
    ],
    format: ["esm", "cjs"],
    treeshake: true,
  },
] satisfies Options[];
