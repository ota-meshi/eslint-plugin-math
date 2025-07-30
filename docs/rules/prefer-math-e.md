---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-e"
description: "enforce the use of Math.E instead of other ways"
since: "v0.5.0"
---

# math/prefer-math-e

> enforce the use of Math.E instead of other ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.E` instead of other ways to represent Euler's number (e).

`Math.E` provides several advantages over alternatives:

- **Clarity of intent**: Immediately obvious that you're using Euler's number (e)
- **Consistency**: Standardizes how mathematical constants are used across your codebase
- **Precision**: `Math.E` provides the most accurate representation available in JavaScript
- **Performance**: Direct constant access instead of function call overhead
- **Maintainability**: Reduces the risk of typos in hardcoded values

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-e: 'error' */

/* ✓ GOOD */
// Using the Math.E constant
x = Math.E;

/* ✗ BAD */
// Using Math.exp(1) to get e
x = Math.exp(1);

// Using hardcoded literal value
x = 2.718281828459045;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.E](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/E)
- [MDN - Math.exp()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/exp)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.5.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-e.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-e.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-e)
