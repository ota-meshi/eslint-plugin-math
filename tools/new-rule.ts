import path from "path";
import fs from "fs";
import cp from "child_process";
const logger = console;

// main
((ruleId) => {
  if (ruleId == null) {
    logger.error("Usage: npm run new <RuleID>");
    process.exitCode = 1;
    return;
  }
  if (!/^[\w-]+$/u.test(ruleId)) {
    logger.error("Invalid RuleID '%s'.", ruleId);
    process.exitCode = 1;
    return;
  }

  const ruleFile = path.resolve(__dirname, `../src/rules/${ruleId}.ts`);
  const testFile = path.resolve(__dirname, `../tests/src/rules/${ruleId}.ts`);
  const fixturesRoot = path.resolve(
    __dirname,
    `../tests/fixtures/rules/${ruleId}/`,
  );
  const docFile = path.resolve(__dirname, `../docs/rules/${ruleId}.md`);
  const changesetFile = path.resolve(__dirname, `../.changeset/${ruleId}.md`);

  fs.mkdirSync(path.dirname(ruleFile), { recursive: true });
  fs.mkdirSync(path.dirname(testFile), { recursive: true });
  fs.mkdirSync(path.dirname(docFile), { recursive: true });
  fs.mkdirSync(fixturesRoot, { recursive: true });
  fs.mkdirSync(path.resolve(fixturesRoot, "valid"), { recursive: true });
  fs.mkdirSync(path.resolve(fixturesRoot, "invalid"), { recursive: true });

  fs.writeFileSync(
    ruleFile,
    `import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils"

export default createRule("${ruleId}", {
    meta: {
        docs: {
            description: "...",
            categories: ["..."],
        },
        fixable: null,
        hasSuggestions: null,
        schema: [],
        messages: {},
        type: "",
    },
    create(context) {
      const sourceCode = context.sourceCode

        return {
          // ...
        }
    },
})
`,
  );
  fs.writeFileSync(
    testFile,
    `import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/${ruleId}"
import { loadTestCases } from "../../utils/utils"

const tester = new SnapshotRuleTester()

tester.run("${ruleId}", rule as any, loadTestCases("${ruleId}"))
`,
  );
  fs.writeFileSync(
    docFile,
    `#  (math/${ruleId})

> description

## :book: Rule Details

This rule reports ???.


<eslint-code-block fix>

<!-- eslint-skip -->

\`\`\`js
/* eslint math/${ruleId}: 'error' */

/* ✓ GOOD */
x = Math.trunc(n);

/* ✗ BAD */
x = n >= 0 ? Math.floor(n) : Math.ceil(n);
\`\`\`

</eslint-code-block>

## :wrench: Options

Nothing.

\`\`\`json
{
  "math/${ruleId}": [
    "error",
    "opt"
  ]
\`\`\`

- 

## :books: Further reading

- 

## :couple: Related rules

- [xxx]

[xxx]: https://xxx

`,
  );
  fs.writeFileSync(
    changesetFile,
    `---
"eslint-plugin-math": minor
---

feat: add \`math/${ruleId}\` rule
`,
  );

  cp.execSync(`code "${ruleFile}"`);
  cp.execSync(`code "${testFile}"`);
  cp.execSync(`code "${docFile}"`);
})(process.argv[2]);
