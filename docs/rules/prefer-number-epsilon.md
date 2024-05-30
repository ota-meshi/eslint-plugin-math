---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-epsilon"
description: "enforce the use of Number.EPSILON instead of other ways"
since: "v0.5.0"
---

# math/prefer-number-epsilon

> enforce the use of Number.EPSILON instead of other ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## 📖 Rule Details

This rule aims to enforce the use of `Number.EPSILON` instead of other ways.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-epsilon: 'error' */

/* ✓ GOOD */
x = Number.EPSILON;

/* ✗ BAD */
x = 2 ** -52;
x = Math.pow(2, -52);
x = 2.220446049250313e-16;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Number.EPSILON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.5.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-epsilon.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-epsilon.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-epsilon)
