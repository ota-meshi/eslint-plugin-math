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

This rule disallows static calculations that result in NaN (Not a Number).

This rule enforces explicit use of `NaN` or `Number.NaN` instead of calculations that implicitly produce NaN values.

Using explicit NaN values provides several benefits:

- **Clear intent**: Makes it obvious that NaN is the intended result
- **Better readability**: Reduces cognitive load when reading code
- **Consistency**: Standardizes how NaN values are represented
- **Debugging clarity**: Easier to identify intentional vs accidental NaN values
- **Code maintainability**: Explicit NaN usage is more self-documenting

This rule helps catch expressions that will always evaluate to NaN at development time and suggests using explicit NaN constants instead.

<eslint-code-block>

<!-- eslint-skip -->

```js
/* eslint math/no-static-nan-calculations: 'error' */

/* ✓ GOOD */
// Explicit NaN usage (when intentional)
x = NaN;
x = Number.NaN;

// Dynamic parsing (runtime dependent)
x = Number(userInput);
x = parseInt(userInput, 16);
x = Number.parseInt(dynamicValue, 16);

// Valid mathematical operations
x = Infinity + Infinity;  // Results in Infinity
x = Math.sqrt(4);         // Results in 2
x = Math.pow(2, 3);       // Results in 8

/* ✗ BAD */
// Infinity arithmetic that produces NaN
x = Infinity - Infinity;
x = Number.POSITIVE_INFINITY - Number.POSITIVE_INFINITY;
x = Infinity / Infinity;
x = 0 / 0;

// Invalid string parsing
x = Number("invalid");
x = parseFloat("not-a-number");
x = parseInt("abc");         // No radix, invalid string
x = Number.parseFloat("xyz");
x = Number.parseInt("def");

// Invalid Math operations
x = Math.pow();              // No arguments
x = Math.pow(-4, 0.5);       // Square root of negative number
x = Math.sqrt(-4);           // Square root of negative number
x = (-4) ** 0.5;             // Exponentiation with negative base and fractional exponent

// Operations with NaN
x = NaN + 1;
x = NaN * 5;
x = NaN / 2;
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
