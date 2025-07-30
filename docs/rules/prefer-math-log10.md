---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-log10"
description: "enforce the use of Math.log10() instead of other calculation methods."
since: "v0.4.0"
---

# math/prefer-math-log10

> enforce the use of Math.log10() instead of other calculation methods.

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.log10()` instead of other calculation methods for computing base-10 logarithms.

`Math.log10()` provides several advantages over manual calculations:

- **Clarity of intent**: Immediately obvious that you're calculating a base-10 logarithm
- **Performance**: Optimized native implementation, potentially faster than manual calculations
- **Precision**: More accurate for edge cases and special values
- **Readability**: Shorter and more expressive than conversion formulas
- **Consistency**: Part of the ES2015 Math API family

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-log10: 'error' */

/* ✓ GOOD */
// Using Math.log10 for clarity and performance
x = Math.log10(n);

/* ✗ BAD */
// Manual conversion using natural logarithm and constants
x = Math.log(n) * Math.LOG10E;
x = Math.log(n) / Math.LN10;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.log10()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10)
- [MDN - Math.log()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log)
- [MDN - Math.LOG10E](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG10E)
- [MDN - Math.LN10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN10)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-log10.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-log10.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-log10)
