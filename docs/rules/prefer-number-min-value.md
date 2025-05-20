---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-min-value"
description: "enforce the use of Number.MIN_VALUE instead of literal number"
since: "v0.7.0"
---

# math/prefer-number-min-value

> enforce the use of Number.MIN_VALUE instead of literal number

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## 📖 Rule Details

This rule aims to enforce the use of `Number.MIN_VALUE` instead of literal number.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-min-value: 'error' */

/* ✓ GOOD */
x = Number.MIN_VALUE;

/* ✗ BAD */
x = 5e-324;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Number.MIN_VALUE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.7.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-min-value.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-min-value.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-min-value)
