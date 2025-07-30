---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-max-value"
description: "enforce the use of Number.MAX_VALUE instead of literal number"
since: "v0.5.0"
---

# math/prefer-number-max-value

> enforce the use of Number.MAX_VALUE instead of literal number

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## 📖 Rule Details

This rule aims to enforce the use of `Number.MAX_VALUE` instead of literal number representations of the maximum finite representable number.

`Number.MAX_VALUE` provides several advantages over hardcoded literals:

- **Clarity of intent**: Immediately obvious that you're using the maximum finite number
- **Precision**: Guaranteed to be the exact maximum representable value
- **Maintainability**: Avoids potential typos in extremely large literal values
- **Standards compliance**: Uses the official IEEE 754 double-precision maximum

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-max-value: 'error' */

/* ✓ GOOD */
x = Number.MAX_VALUE;

/* ✗ BAD */
// Hardcoded literal (error-prone)
x = 1.7976931348623157e+308;

// Complex mathematical expression (unnecessary)
x = 2 ** 1023 - 2 ** 971 + 2 ** 1023;

// Using imprecise approximations
x = 1.79e308; // Inaccurate
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Number.MAX_VALUE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.5.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-max-value.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-max-value.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-max-value)
