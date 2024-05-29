---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-log2e"
description: "enforce the use of Math.LOG2E instead of other ways"
since: "v0.4.0"
---

# math/prefer-math-log2e

> enforce the use of Math.LOG2E instead of other ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.LOG2E` instead of other ways.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-log2e: 'error' */

/* ✓ GOOD */
x = Math.LOG2E;

/* ✗ BAD */
x = Math.log2(Math.E);
x = 1 / Math.LN2;

/* ✓ GOOD */
x = y * Math.LOG2E;

/* ✗ BAD */
x = y / Math.LN2;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.LOG2E](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG2E)
- [MDN - Math.log2()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2)
- [MDN - Math.LN2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-log2e.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-log2e.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-log2e)
