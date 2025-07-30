---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-log2"
description: "enforce the use of Math.log2() instead of other calculation methods."
since: "v0.4.0"
---

# math/prefer-math-log2

> enforce the use of Math.log2() instead of other calculation methods.

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.log2()` instead of other calculation methods for computing base-2 logarithms.

`Math.log2()` provides several advantages over manual calculations:

- **Clarity of intent**: Immediately obvious that you're calculating a base-2 logarithm
- **Performance**: Optimized native implementation, potentially faster than manual calculations
- **Precision**: More accurate for edge cases and special values
- **Computer science relevance**: Base-2 is fundamental in computing and algorithms
- **Consistency**: Part of the ES2015 Math API family

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-log2: 'error' */

/* ✓ GOOD */
// Using Math.log2 for clarity and performance
x = Math.log2(n);

/* ✗ BAD */
// Manual conversion using natural logarithm and constants
x = Math.log(n) * Math.LOG2E;
x = Math.log(n) / Math.LN2;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.log2()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2)
- [MDN - Math.log()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log)
- [MDN - Math.LOG2E](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG2E)
- [MDN - Math.LN2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-log2.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-log2.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-log2)
