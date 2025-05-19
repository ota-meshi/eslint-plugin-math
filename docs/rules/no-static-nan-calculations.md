---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/no-static-nan-calculations"
description: "disallow static calculations that result in NaN"
since: "v0.5.0"
---

# math/no-static-nan-calculations

> disallow static calculations that result in NaN

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule disallow static calculations that result in NaN.

<eslint-code-block>

<!-- eslint-skip -->

```js
/* eslint math/no-static-nan-calculations: 'error' */

/* ✓ GOOD */
x = NaN;
x = Number.NaN;
x = Number("42");
x = parseInt("a", 16);
x = Number.parseInt("a", 16);
x = Infinity + Infinity;

/* ✗ BAD */
x = Infinity - Infinity;
x = Number.POSITIVE_INFINITY - Number.POSITIVE_INFINITY;
x = Number("a");
x = parseFloat("a");
x = parseInt("a");
x = Number.parseFloat("a");
x = Number.parseInt("a");
x = Math.pow();
x = Math.pow(-4, 0.5);
x = Math.sqrt(-4);
x = (-4) ** 0.5;
x = NaN + 1;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)
- [MDN - Number.NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NaN)

## 👫 Related rules

- [math/no-static-infinity-calculations]

[math/no-static-infinity-calculations]: ./no-static-infinity-calculations.md

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.5.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/no-static-nan-calculations.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/no-static-nan-calculations.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/no-static-nan-calculations)
