---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-sqrt1-2"
description: "enforce the use of Math.SQRT1_2 instead of other ways"
since: "v0.4.0"
---

# math/prefer-math-sqrt1-2

> enforce the use of Math.SQRT1_2 instead of other ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.SQRT1_2` instead of other ways to represent the square root of 1/2.

`Math.SQRT1_2` provides several advantages over manual calculations:

- **Clarity of intent**: Immediately obvious that you're using √(1/2) or 1/√2
- **Precision**: Provides the most accurate representation available in JavaScript
- **Performance**: Direct constant access instead of function call overhead
- **Mathematical significance**: Represents a fundamental constant in trigonometry and linear algebra
- **Readability**: More expressive than complex calculations

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-sqrt1-2: 'error' */

/* ✓ GOOD */
x = Math.SQRT1_2;

/* ✗ BAD */
// Manual calculation with sqrt
x = Math.sqrt(1/2);
x = Math.sqrt(0.5);

// Manual calculation with exponentiation
x = (1 / 2) ** 0.5;
x = 0.5 ** 0.5;
```

<!--
TODO
// Division by Math.SQRT2
x = 1 / Math.SQRT2;
-->

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.SQRT1_2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT1_2)
- [MDN - Math.sqrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-sqrt1-2.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-sqrt1-2.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-sqrt1-2)
