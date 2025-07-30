---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-log10e"
description: "enforce the use of Math.LOG10E instead of other ways"
since: "v0.4.0"
---

# math/prefer-math-log10e

> enforce the use of Math.LOG10E instead of other ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.LOG10E` instead of other ways to represent the base-10 logarithm of Euler's number (e).

`Math.LOG10E` provides several advantages over manual calculations:

- **Clarity of intent**: Immediately obvious that you're using the base-10 logarithm of e
- **Precision**: Provides the most accurate representation available in JavaScript
- **Performance**: Direct constant access instead of function call overhead
- **Consistency**: Part of the standardized Math constants family
- **Mathematical accuracy**: Avoids rounding errors from manual calculations

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-log10e: 'error' */

/* ✓ GOOD */
// Using Math.LOG10E for logarithmic conversions
x = Math.LOG10E;

/* ✗ BAD */
// Using Math.log10 function call
x = Math.log10(Math.E);

// Using mathematical relationship
x = 1 / Math.LN10;

/* ✓ GOOD */
x = y * Math.LOG10E;

/* ✗ BAD */
x = y / Math.LN10;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.LOG10E](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG10E)
- [MDN - Math.log10()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10)
- [MDN - Math.LN10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN10)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-log10e.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-log10e.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-log10e)
