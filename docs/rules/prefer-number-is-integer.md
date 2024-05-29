---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-is-integer"
description: "enforce the use of Number.isInteger() instead of other checking ways"
since: "v0.2.0"
---

# math/prefer-number-is-integer

> enforce the use of Number.isInteger() instead of other checking ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Number.isInteger()` instead of other checking ways.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-is-integer: 'error' */

/* ✓ GOOD */
x = Number.isInteger(n);

/* ✗ BAD */
x = Math.floor(n) === n;
x = Math.ceil(n) === n;
x = Math.trunc(n) === n;
x = Math.round(n) === n;

z = n % 1 ? a : b;
x = parseInt(n, 10) === n;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Number.isInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger)
- [MDN - Math.trunc()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc)
- [MDN - Math.floor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)
- [MDN - Math.ceil()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil)
- [MDN - Math.round()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round)
- [MDN - Remainder (`%`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)
- [MDN - parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.2.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-is-integer.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-is-integer.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-is-integer)
