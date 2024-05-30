---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-pi"
description: "enforce the use of Math.PI instead of literal number"
since: "v0.5.0"
---

# math/prefer-math-pi

> enforce the use of Math.PI instead of literal number

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## 📖 Rule Details

This rule aims to enforce the use of `Math.PI` instead of literal number.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-pi: 'error' */

/* ✓ GOOD */
x = Math.PI;

/* ✗ BAD */
x = 3.141592653589793;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.PI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.5.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-pi.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-pi.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-pi)
