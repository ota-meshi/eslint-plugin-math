import path from "path";
import assert from "assert";
import { getLegacyESLint } from "eslint-compat-utils/eslint";
import * as plugin from "../../src/index";

// eslint-disable-next-line @typescript-eslint/naming-convention -- Class name
const ESLint = getLegacyESLint();

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const TEST_CWD = path.join(__dirname, "../fixtures/integrations/eslint-plugin");

describe("Integration with eslint-plugin-math", () => {
  it("should lint without errors", async () => {
    const engine = new ESLint({
      cwd: TEST_CWD,
      extensions: [".js"],
      plugins: { "eslint-plugin-math": plugin as any },
    });
    const results = await engine.lintFiles(["test01/src"]);
    assert.strictEqual(results.length, 2);
    assert.strictEqual(
      results.reduce((s, a) => s + a.errorCount, 0),
      0,
    );
  });
});
