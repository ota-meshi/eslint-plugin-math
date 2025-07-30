---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-sqrt2"
description: "enforce the use of Math.SQRT2 instead of other ways"
since: "v0.4.0"
---

# math/prefer-math-sqrt2

> enforce the use of Math.SQRT2 instead of other ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.SQRT2` instead of other ways to calculate the square root of 2.

`Math.SQRT2` provides several advantages over manual calculations:

- **Clarity of intent**: Immediately obvious that you're using √2
- **Precision**: Provides the most accurate representation available in JavaScript
- **Performance**: Direct constant access instead of function call overhead
- **Mathematical significance**: Represents a fundamental irrational constant
- **Readability**: More expressive than complex calculations

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-sqrt2: 'error' */

/* ✓ GOOD */
x = Math.SQRT2;

/* ✗ BAD */
// Manual square root calculation
x = Math.sqrt(2);

// Manual exponentiation
x = 2 ** (1 / 2);
x = 2 ** 0.5;

// Mathematical operations that equal √2
x = Math.pow(2, 0.5);
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.SQRT2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT2)
- [MDN - Math.sqrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-sqrt2.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-sqrt2.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-sqrt2)
