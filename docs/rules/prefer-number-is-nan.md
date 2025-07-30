---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-is-nan"
description: "enforce the use of Number.isNaN() instead of other checking ways"
since: "v0.4.0"
---

# math/prefer-number-is-nan

> enforce the use of Number.isNaN() instead of other checking ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Number.isNaN()` instead of other checking ways.

`Number.isNaN()` is the most reliable way to check for NaN values because:

- **Type safety**: Only returns `true` for actual NaN values, not for non-numeric types
- **No type coercion**: Unlike global `isNaN()`, it doesn't convert values to numbers first
- **Clear intent**: Explicitly shows you're checking for the NaN value
- **Performance**: Direct comparison without type conversion overhead
- **Consistency**: Part of the modern Number API alongside other type-checking methods

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-is-nan: 'error' */

/* ✓ GOOD */
// Clear and explicit NaN checking
if (Number.isNaN(value)) {
  console.log('Value is NaN');
}

const result = Number.isNaN(calculation);
const hasNaN = values.some(Number.isNaN);

/* ✗ BAD */
// Global isNaN with type checking workaround
if (typeof value === 'number' && isNaN(value)) {
  console.log('Value is NaN');
}

// Self-comparison (cryptic)
if (value !== value) {
  console.log('Value is NaN');
}

// Object.is comparison (unnecessary complexity)
if (Object.is(value, NaN)) {
  console.log('Value is NaN');
}
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Number.isNaN()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-is-nan.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-is-nan.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-is-nan)
