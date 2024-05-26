"use strict";

// const version = require("./package.json").version

module.exports = {
  parserOptions: {
    sourceType: "script",
    ecmaVersion: 2020,
    project: require.resolve("./tsconfig.json"),
  },
  extends: [
    "plugin:@ota-meshi/recommended",
    "plugin:@ota-meshi/+node",
    "plugin:@ota-meshi/+typescript",
    "plugin:@ota-meshi/+eslint-plugin",
    "plugin:@ota-meshi/+vue3",
    "plugin:@ota-meshi/+json",
    "plugin:@ota-meshi/+yaml",
    "plugin:@ota-meshi/+md",
    "plugin:@ota-meshi/+prettier",
  ],
  rules: {
    "no-warning-comments": "warn",
    "no-lonely-if": "off",
    "new-cap": "off",
    "no-shadow": "off",
    "func-style": "off",
    "jsonc/object-curly-spacing": "off",
    "jsonc/array-element-newline": "off",
    "jsonc/object-property-newline": "off",
    "jsonc/object-curly-newline": "off",
    "no-restricted-properties": [
      "error",
      { object: "context", property: "getSourceCode" },
      { object: "context", property: "getFilename" },
      { object: "context", property: "getCwd" },
      { object: "context", property: "getScope" },
      { object: "context", property: "parserServices" },
    ],
    complexity: "off",
    "n/no-extraneous-import": [
      "error",
      {
        allowModules: [
          "@typescript-eslint/types",
          "@typescript-eslint/scope-manager",
        ],
      },
    ],
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@typescript-eslint/scope-manager",
            message: "Please don't use @typescript-eslint/scope-manager value.",
            allowTypeImports: true,
          },
          {
            name: "@typescript-eslint/types",
            message: "Please don't use @typescript-eslint/types value.",
            allowTypeImports: true,
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["*.ts", "*.mts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        project: require.resolve("./tsconfig.json"),
      },
      rules: {
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "default",
            format: ["camelCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
          {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
          {
            selector: "typeLike",
            format: ["PascalCase"],
          },
          {
            selector: "property",
            format: null,
          },
          {
            selector: "method",
            format: null,
          },
          {
            selector: "import",
            format: ["camelCase", "PascalCase", "UPPER_CASE"],
          },
        ],
      },
    },
    {
      files: ["src/rules/**"],
      rules: {
        // "@mysticatea/eslint-plugin/report-message-format": [
        //     "error",
        //     "[^a-z].*\\.$",
        // ],
        // "@mysticatea/eslint-plugin/require-meta-docs-url": "off",
      },
    },
    {
      files: ["scripts/**/*.ts", "tests/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        project: require.resolve("./tsconfig.json"),
      },
      rules: {
        "jsdoc/require-jsdoc": "off",
        "n/no-extraneous-import": "off",
        "no-console": "off",
        "@typescript-eslint/no-misused-promises": "off",
      },
    },
    {
      files: ["*.vue"],
      parserOptions: {
        sourceType: "module",
      },
      globals: {
        require: true,
      },
    },
    {
      files: ["docs/.vitepress/**"],
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
      globals: {
        window: true,
      },
      rules: {
        "jsdoc/require-jsdoc": "off",
        "n/no-extraneous-import": "off",
        "n/file-extension-in-import": "off",
      },
    },
    {
      files: ["*.mjs"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: ["*.md/**", "**/*.md/**"],
      rules: {
        "n/no-missing-import": "off",
      },
    },
    {
      files: ["docs/.vitepress/**/*.*"],
      rules: {
        "eslint-plugin/require-meta-docs-description": "off",
        "eslint-plugin/require-meta-docs-url": "off",
        "eslint-plugin/require-meta-type": "off",
        "eslint-plugin/prefer-message-ids": "off",
        "eslint-plugin/prefer-object-rule": "off",
        "eslint-plugin/require-meta-schema": "off",
      },
    },
  ],
};
