import myPlugin from "@ota-meshi/eslint-plugin";
import tseslint from "typescript-eslint";
// import tseslint from "typescript-eslint";
export default [
  ...myPlugin.config({
    node: true,
    ts: true,
    eslintPlugin: true,
    packageJson: true,
    json: true,
    yaml: true,
    md: true,
    prettier: true,
    vue3: true,
  }),
  {
    rules: {
      complexity: "off",
      "func-style": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.mts"],
    rules: {
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        {
          allowDefaultCaseForExhaustiveSwitch: false,
          considerDefaultExhaustiveForUnions: true,
          requireDefaultForNonUnion: true,
        },
      ],
      "default-case": "off",
    },
  },
  {
    files: ["**/*.md", "*.md"].flatMap((pattern) => [
      `${pattern}/*.js`,
      `${pattern}/*.mjs`,
    ]),
    rules: {
      "n/no-missing-import": "off",
    },
  },
  {
    files: ["docs/.vitepress/**"].flatMap((pattern) => [
      `${pattern}/*.js`,
      `${pattern}/*.mjs`,
      `${pattern}/*.ts`,
      `${pattern}/*.mts`,
      `${pattern}/*.vue`,
    ]),
    rules: {
      "jsdoc/require-jsdoc": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // なぜ有効になっているか不明。要調査
      "vue/no-v-model-argument": "off",
    },
    languageOptions: {
      globals: {
        window: "readonly",
      },
    },
  },
  ...tseslint.config({
    files: ["tests/fixtures/**/*.{js,ts}"],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      "jsdoc/require-jsdoc": "off",
      "no-undef": "off",
      "no-lone-blocks": "off",
      "no-unused-vars": "off",
      "no-shadow": "off",
      yoda: "off",
      "no-empty": "off",
      "no-self-compare": "off",
      radix: "off",
      "no-implicit-coercion": "off",
      "no-void": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  }),
  {
    files: ["tests/fixtures/**/*ignore-format*.js"],
    rules: {
      "prettier/prettier": "off",
    },
  },
  {
    ignores: [
      ".nyc_output/",
      "coverage/",
      "node_modules/",
      "lib/",
      "!.github/",
      "!.vscode/",
      "!.devcontainer/",
      "!docs/.vitepress/",
      "docs/.vitepress/cache/",
      "docs/.vitepress/build-system/shim/",
      "docs/.vitepress/dist/",
    ],
  },
];
