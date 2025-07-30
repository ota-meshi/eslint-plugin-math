---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-sqrt"
description: "enforce the use of Math.sqrt() instead of other square root calculations"
since: "v0.3.0"
---

# math/prefer-math-sqrt

> enforce the use of Math.sqrt() instead of other square root calculations

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.sqrt()` instead of other square root calculations.

Using `Math.sqrt()` provides several advantages:

- **Clarity of intent**: Immediately obvious that you're calculating a square root
- **Performance**: Optimized native implementation
- **Reliability**: Handles edge cases consistently
- **Standard practice**: Widely recognized mathematical function

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-sqrt: 'error' */

/* ✓ GOOD */
distance = Math.sqrt(x * x + y * y);
standardDeviation = Math.sqrt(variance);
magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
quadraticRoot = Math.sqrt(discriminant);

/* ✗ BAD */
distance = Math.pow(x * x + y * y, 0.5);
standardDeviation = Math.pow(variance, 1 / 2);
magnitude = (vector.x ** 2 + vector.y ** 2) ** 0.5;
quadraticRoot = discriminant ** (1 / 2);
```

</eslint-code-block>

### Important Edge Case

Note that the results are different when the input is `-Infinity`:

```js
Math.sqrt(-Infinity)        // NaN
Math.pow(-Infinity, 1/2)    // Infinity  
(-Infinity) ** 1/2          // Infinity
```

If you do not use `-Infinity` in your calculations, it is a safe replacement.

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.sqrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)
- [MDN - Math.pow()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)
- [MDN - Exponentiation (`**`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.3.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-sqrt.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-sqrt.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-sqrt)
