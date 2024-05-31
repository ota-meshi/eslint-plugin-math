---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-hypot"
description: "enforce the use of Math.hypot() instead of other hypotenuse calculations"
since: "v0.6.0"
---

# math/prefer-math-hypot

> enforce the use of Math.hypot() instead of other hypotenuse calculations

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.hypot()` instead of other hypotenuse calculations.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-hypot: 'error' */

/* ✓ GOOD */
x = Math.hypot(a, b);

/* ✗ BAD */
x = Math.sqrt(a * a + b * b);
x = (a * a + b * b) ** (1 / 2);
x = Math.sqrt(a ** 2 + b ** 2);
x = (a ** 2 + b ** 2) ** (1 / 2);
x = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
x = Math.pow(a ** 2 + b ** 2, 1 / 2);
```

</eslint-code-block>

Note that the results are different when dealing with strictly non-finite numbers.

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.hypot()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot)
- [MDN - Math.sqrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)
- [MDN - Exponentiation (`**`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)
- [MDN - Math.pow()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.6.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-hypot.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-hypot.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-hypot)
