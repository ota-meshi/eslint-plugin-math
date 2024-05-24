import path from "path";
import fs from "fs";
import { rules } from "./lib/load-rules";

const RULESET_NAME = {
  recommended: "../src/configs/recommended.ts",
};
const FLAT_RULESET_NAME = {
  recommended: "../src/configs/flat/recommended.ts",
};

for (const rec of ["recommended"] as const) {
  const content = `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
export const plugins = ["math"];
export const rules = {
  // eslint-plugin-math rules
  ${rules
    .filter(
      (rule) =>
        rule.meta.docs.categories &&
        !rule.meta.deprecated &&
        rule.meta.docs.categories.includes(rec),
    )
    .map((rule) => {
      const conf = rule.meta.docs.default || "error";
      return `"${rule.meta.docs.ruleId}": "${conf}"`;
    })
    .join(",\n")}
};
`;

  const filePath = path.resolve(__dirname, RULESET_NAME[rec]);

  // Update file.
  fs.writeFileSync(filePath, content);
}

for (const rec of ["recommended"] as const) {
  const content = `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import type { ESLint, Linter } from "eslint";
export const plugins = {
  get math(): ESLint.Plugin {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- ignore
    return require("../../index.js");
  },
};
export const rules: Linter.RulesRecord = {
  // eslint-plugin-math rules
  ${rules
    .filter(
      (rule) =>
        rule.meta.docs.categories &&
        !rule.meta.deprecated &&
        rule.meta.docs.categories.includes(rec),
    )
    .map((rule) => {
      const conf = rule.meta.docs.default || "error";
      return `"${rule.meta.docs.ruleId}": "${conf}"`;
    })
    .join(",\n")}
};
`;

  const filePath = path.resolve(__dirname, FLAT_RULESET_NAME[rec]);

  // Update file.
  fs.writeFileSync(filePath, content);
}
