---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/no-static-infinity-calculations"
description: "disallow static calculations that result in infinity"
since: "v0.5.0"
---

# math/no-static-infinity-calculations

> disallow static calculations that result in infinity

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule disallow static calculations that result in infinity.

<eslint-code-block>

<!-- eslint-skip -->

```js
/* eslint math/no-static-infinity-calculations: 'error' */

/* ✓ GOOD */
x = Infinity;
x = -Infinity;
x = Number.POSITIVE_INFINITY;
x = Number.NEGATIVE_INFINITY;
x = 2 ** 1023 - 2 ** 971 + 2 ** 1023;

/* ✗ BAD */
x = 2 ** 1024;
x = 2 ** 1024 - 2 ** 971;
x = 2 ** 1023 + 2 ** 1023;
x = 2 ** 1023 - 2 ** 970 + 2 ** 1023;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)
- [MDN - Number.POSITIVE_INFINITY](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY)
- [MDN - Number.NEGATIVE_INFINITY](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY)

## 👫 Related rules

- [math/no-static-nan-calculations]

[math/no-static-nan-calculations]: ./no-static-nan-calculations.md

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.5.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/no-static-infinity-calculations.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/no-static-infinity-calculations.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/no-static-infinity-calculations)
