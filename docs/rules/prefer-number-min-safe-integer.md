---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-min-safe-integer"
description: "enforce the use of Number.MIN_SAFE_INTEGER instead of other ways"
since: "v0.3.0"
---

# math/prefer-number-min-safe-integer

> enforce the use of Number.MIN_SAFE_INTEGER instead of other ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Number.MIN_SAFE_INTEGER` instead of other ways.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-min-safe-integer: 'error' */

/* ✓ GOOD */
x = Number.MIN_SAFE_INTEGER;

/* ✗ BAD */
x = -0x1FFFFFFFFFFFFF;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN: Number.MIN_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.3.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-min-safe-integer.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-min-safe-integer.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-min-safe-integer)
