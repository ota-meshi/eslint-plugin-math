---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-is-safe-integer"
description: "enforce the use of Number.isSafeInteger() instead of other checking ways"
since: "v0.3.0"
---

# math/prefer-number-is-safe-integer

> enforce the use of Number.isSafeInteger() instead of other checking ways

- :gear: This rule is included in `"plugin:math/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule aims to enforce the use of `Number.isSafeInteger()` instead of other checking ways.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-is-safe-integer: 'error' */

/* ✓ GOOD */
x = Number.isSafeInteger(n);

/* ✗ BAD */
x = Number.isInteger(n) && Number.MIN_SAFE_INTEGER <= n && n<= Number.MAX_SAFE_INTEGER;
x = Number.isInteger(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER;
x = Number.isInteger(n) && Math.abs(n) <= 0x1FFFFFFFFFFFFF;
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [MDN - Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)
- [MDN - Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
- [MDN - Number.MIN_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER)

## :rocket: Version

This rule was introduced in eslint-plugin-math v0.3.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-is-safe-integer.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-is-safe-integer.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-is-safe-integer)
