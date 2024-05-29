---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-cbrt"
description: "enforce the use of Math.cbrt() instead of other cube root calculations"
since: "v0.3.0"
---

# math/prefer-math-cbrt

> enforce the use of Math.cbrt() instead of other cube root calculations

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.cbrt()` instead of other cube root calculations.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-cbrt: 'error' */

/* ✓ GOOD */
x = Math.cbrt(n);

/* ✗ BAD */
x = Math.pow(n, 1 / 3);
x = n ** (1 / 3);
```

</eslint-code-block>

Note that the results are different when `n` is `-Infinity`. If you do not use `-Infinity` it is a safe replacement.

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.cbrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt)
- [MDN - Math.pow()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)
- [MDN - Exponentiation (`**`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.3.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-cbrt.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-cbrt.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-cbrt)
