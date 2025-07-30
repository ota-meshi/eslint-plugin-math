---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-is-safe-integer"
description: "enforce the use of Number.isSafeInteger() instead of other checking ways"
since: "v0.3.0"
---

# math/prefer-number-is-safe-integer

> enforce the use of Number.isSafeInteger() instead of other checking ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Number.isSafeInteger()` instead of other checking ways to determine if a value is a safe integer.

`Number.isSafeInteger()` provides several advantages over manual range checking:

- **Type safety**: Only returns `true` for actual numbers that are safe integers
- **Comprehensive checking**: Combines integer checking with safe range validation
- **Clear semantics**: Explicitly designed for safe integer validation
- **Performance**: Single optimized function call instead of multiple checks
- **Precision awareness**: Accounts for JavaScript's floating-point precision limits

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-is-safe-integer: 'error' */

/* ✓ GOOD */
// Clear and comprehensive safe integer checking
x = Number.isSafeInteger(n);

/* ✗ BAD */
// Verbose manual range checking
x = Number.isInteger(n) && Number.MIN_SAFE_INTEGER <= n && n <= Number.MAX_SAFE_INTEGER;
x = Number.isInteger(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER;

// Hardcoded hex values (less readable)
x = Number.isInteger(n) && Math.abs(n) <= 0x1FFFFFFFFFFFFF;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)
- [MDN - Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
- [MDN - Number.MIN_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.3.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-is-safe-integer.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-is-safe-integer.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-is-safe-integer)
