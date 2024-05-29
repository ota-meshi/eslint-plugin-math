---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-log10e"
description: "enforce the use of Math.LOG10E instead of other ways"
since: "v0.4.0"
---

# math/prefer-math-log10e

> enforce the use of Math.LOG10E instead of other ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.LOG10E` instead of other ways.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-log10e: 'error' */

/* ✓ GOOD */
x = Math.LOG10E;

/* ✗ BAD */
x = Math.log10(Math.E);
x = 1 / Math.LN10;

/* ✓ GOOD */
x = y * Math.LOG10E;

/* ✗ BAD */
x = y / Math.LN10;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.LOG10E](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG10E)
- [MDN - Math.log10()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10)
- [MDN - Math.LN10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN10)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-log10e.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-log10e.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-log10e)
