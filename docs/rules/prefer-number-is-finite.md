---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-is-finite"
description: "enforce the use of Number.isFinite() instead of other checking ways"
since: "v0.4.0"
---

# math/prefer-number-is-finite

> enforce the use of Number.isFinite() instead of other checking ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Number.isFinite()` instead of other checking ways.

`Number.isFinite()` is the preferred method for checking if a value is a finite number because:

- **Type safety**: Only returns `true` for actual finite numbers, not for strings that can be converted
- **No type coercion**: Unlike global `isFinite()`, it doesn't convert values to numbers first
- **Clear semantics**: Explicitly checks for finite numeric values
- **Performance**: Direct type and value checking without conversion overhead
- **Consistency**: Part of the modern Number API family

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-is-finite: 'error' */
const value = 42;

/* ✓ GOOD */
// Modern, type-safe approach
if (Number.isFinite(value)) {
  console.log('Value is a finite number');
}

/* ✗ BAD */
// Verbose type checking with global isFinite
if (typeof value === 'number' && isFinite(value)) {
  console.log('Value is a finite number');
}

// Manual infinity and NaN checking
if (typeof value === 'number' && value !== Infinity && value !== -Infinity && !isNaN(value)) {
  console.log('Value is a finite number');
}

// Using global isFinite directly (type coercion issues)
if (isFinite(value)) {
  console.log('Value might not actually be a number');
}
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Number.isFinite()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-is-finite.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-is-finite.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-is-finite)
