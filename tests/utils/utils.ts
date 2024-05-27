import fs from "fs";
import path from "path";
import type { RuleTester } from "eslint";

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 */
export function unIndent(strings: readonly string[]): string {
  const templateValue = strings[0];
  const lines = templateValue.split("\n");
  const minLineIndent = getMinIndent(lines);

  return lines.map((line) => line.slice(minLineIndent)).join("\n");
}

/**
 * for `code` and `output`
 */
export function unIndentCodeAndOutput([code]: readonly string[]): (
  args: readonly string[],
) => {
  code: string;
  output: string;
} {
  const codeLines = code.split("\n");
  const codeMinLineIndent = getMinIndent(codeLines);

  return ([output]: readonly string[]) => {
    const outputLines = output.split("\n");
    const minLineIndent = Math.min(
      getMinIndent(outputLines),
      codeMinLineIndent,
    );

    return {
      code: codeLines.map((line) => line.slice(minLineIndent)).join("\n"),
      output: outputLines.map((line) => line.slice(minLineIndent)).join("\n"),
    };
  };
}

/**
 * Get number of minimum indent
 */
function getMinIndent(lines: string[]) {
  const lineIndents = lines
    .filter((line) => line.trim())
    .map((line) => / */u.exec(line)![0].length);
  return Math.min(...lineIndents);
}

/**
 * Load test cases
 */
export function loadTestCases(
  ruleName: string,
  _options?: any,
  additionals?: {
    valid?: (RuleTester.ValidTestCase | string)[];
    invalid?: RuleTester.InvalidTestCase[];
  },
): {
  valid: RuleTester.ValidTestCase[];
  invalid: RuleTester.InvalidTestCase[];
} {
  const validFixtureRoot = path.resolve(
    __dirname,
    `../fixtures/rules/${ruleName}/valid/`,
  );
  const invalidFixtureRoot = path.resolve(
    __dirname,
    `../fixtures/rules/${ruleName}/invalid/`,
  );

  const valid = listupInput(validFixtureRoot).map((inputFile) =>
    getConfig(ruleName, inputFile),
  );

  const invalid = listupInput(invalidFixtureRoot).map((inputFile) =>
    getConfig(ruleName, inputFile),
  );

  if (additionals) {
    if (additionals.valid) {
      valid.push(...additionals.valid);
    }
    if (additionals.invalid) {
      invalid.push(...additionals.invalid);
    }
  }
  for (const test of valid) {
    if (!test.code) {
      throw new Error(`Empty code: ${test.filename}`);
    }
  }
  for (const test of invalid) {
    if (!test.code) {
      throw new Error(`Empty code: ${test.filename}`);
    }
  }
  return {
    valid,
    invalid,
  };
}

function listupInput(rootDir: string) {
  return [...itrListupInput(rootDir)];
}

function* itrListupInput(rootDir: string): IterableIterator<string> {
  for (const filename of fs.readdirSync(rootDir)) {
    if (filename.startsWith("_")) {
      // ignore
      continue;
    }
    const abs = path.join(rootDir, filename);
    if (filename.endsWith("input.js") || filename.endsWith("input.vue")) {
      yield abs;
    } else if (fs.statSync(abs).isDirectory()) {
      yield* itrListupInput(abs);
    }
  }
}

function getConfig(ruleName: string, inputFile: string) {
  const filename = inputFile.slice(inputFile.indexOf(ruleName));
  const code0 = fs.readFileSync(inputFile, "utf8");
  let code, config;
  let configFile: string = inputFile.replace(
    /input\.(?:js|ts)$/u,
    "config.json",
  );
  if (!fs.existsSync(configFile)) {
    configFile = path.join(path.dirname(inputFile), "_config.json");
  }
  if (fs.existsSync(configFile)) {
    config = JSON.parse(fs.readFileSync(configFile, "utf8"));
  }
  if (config && typeof config === "object") {
    code = `/* ${filename} */\n${code0}`;
    return Object.assign({}, config, { code, filename });
  }
  // inline config
  const configStr = /^\/\*(.*?)\*\//u.exec(code0);
  if (!configStr) {
    fs.writeFileSync(inputFile, `/* {} */\n${code0}`, "utf8");
    throw new Error("missing config");
  } else {
    code = code0.replace(/^\/\*(.*?)\*\//u, `/*${filename}*/`);
    try {
      config = configStr ? JSON.parse(configStr[1]) : {};
    } catch (e: any) {
      throw new Error(`${e.message} in @ ${inputFile}`);
    }
  }

  return Object.assign({}, config, { code, filename });
}
