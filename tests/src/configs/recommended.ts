import assert from "assert";
import * as plugin from "../../../src/index";
import { LegacyESLint, ESLint } from "../test-lib/eslint-compat";

const code = `x = n >= 0 ? Math.floor(n) : Math.ceil(n);`;
describe("`recommended` config", () => {
  it("legacy `recommended` config should work. ", async () => {
    const linter = new LegacyESLint({
      plugins: {
        math: plugin as never,
      },
      baseConfig: {
        parserOptions: {
          ecmaVersion: 2020,
        },
        extends: ["plugin:math/recommended-legacy"],
      },
      useEslintrc: false,
    });
    const result = await linter.lintText(code, { filePath: "test.js" });
    const messages = result[0].messages;

    assert.deepStrictEqual(
      messages.map((m) => ({
        ruleId: m.ruleId,
        line: m.line,
        message: m.message,
      })),
      [
        {
          line: 1,
          message:
            "Can use 'Math.trunc()', instead of branching on value and using 'Math.floor()' / 'Math.ceil()'.",
          ruleId: "math/prefer-math-trunc",
        },
      ],
    );
  });
  it("`recommended` config should work. ", async () => {
    const linter = new ESLint({
      // @ts-expect-error -- typing bug
      overrideConfigFile: true,
      // @ts-expect-error -- typing bug
      overrideConfig: [plugin.configs.recommended],
    });
    const result = await linter.lintText(code, { filePath: "test.js" });
    const messages = result[0].messages;

    assert.deepStrictEqual(
      messages.map((m) => ({
        ruleId: m.ruleId,
        line: m.line,
        message: m.message,
      })),
      [
        {
          line: 1,
          message:
            "Can use 'Math.trunc()', instead of branching on value and using 'Math.floor()' / 'Math.ceil()'.",
          ruleId: "math/prefer-math-trunc",
        },
      ],
    );
  });
});