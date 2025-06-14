---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-trunc"
description: "enforce the use of Math.trunc() instead of other truncations"
since: "v0.1.0"
---

# math/prefer-math-trunc

> enforce the use of Math.trunc() instead of other truncations

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.trunc()` instead of other truncations.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-trunc: 'error' */

/* ✓ GOOD */
x = Math.trunc(n);

/* ✗ BAD */
x = n >= 0 ? Math.floor(n) : Math.ceil(n);

x = ~~n;    // Same as `Math.trunc(n)` if `-(2 ** 31) - 1 < n < (2 ** 31)`.
x = n & -1; // Same as `Math.trunc(n)` if `-(2 ** 31) - 1 < n < (2 ** 31)`.
x = n | 0;  // Same as `Math.trunc(n)` if `-(2 ** 31) - 1 < n < (2 ** 31)`.
x = n ^ 0;  // Same as `Math.trunc(n)` if `-(2 ** 31) - 1 < n < (2 ** 31)`.
x = n >> 0; // Same as `Math.trunc(n)` if `-(2 ** 31) - 1 < n < (2 ** 31)`.

if (n >= 0) {
    x = Math.floor(n);
} else {
    x = Math.ceil(n);
}
```

</eslint-code-block>

## 🔧 Options

```json
{
  "math/prefer-math-trunc": [
    "error",
    {
      "reportBitwise": true // false
    }
  ]
}
```

- `reportBitwise` ... If `true`, the rule reports bitwise operations that are equivalent to `Math.trunc()`. Defaults to `true`.

## 📚 Further reading

- [MDN - Math.trunc()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc)
- [MDN - Math.floor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)
- [MDN - Math.ceil()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil)
- [MDN - Bitwise NOT (`~`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT)
- [MDN - Bitwise AND (`&`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)
- [MDN - Bitwise OR (`|`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR)
- [MDN - Bitwise XOR (`^`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR)
- [MDN - Right shift (`>>`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.1.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-trunc.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-trunc.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-trunc)
