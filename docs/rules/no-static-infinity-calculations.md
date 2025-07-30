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

This rule disallows static calculations that result in infinity.

This rule enforces explicit use of `Infinity` or `Number.POSITIVE_INFINITY`/`Number.NEGATIVE_INFINITY` instead of calculations that implicitly produce infinity values.

Using explicit infinity values provides several benefits:

- **Clear intent**: Makes it obvious that infinity is the intended result
- **Better readability**: Reduces cognitive load when reading code
- **Consistency**: Standardizes how infinite values are represented
- **Debugging clarity**: Easier to identify intentional vs accidental infinity values
- **JSON compatibility awareness**: Explicit infinity usage makes serialization behavior clear

This rule helps catch expressions that will always evaluate to positive or negative infinity at development time and suggests using explicit infinity constants instead.

<eslint-code-block>

<!-- eslint-skip -->

```js
/* eslint math/no-static-infinity-calculations: 'error' */

/* ✓ GOOD */
// Explicit infinity usage (when intentional)
x = Infinity;
x = -Infinity;
x = Number.POSITIVE_INFINITY;
x = Number.NEGATIVE_INFINITY;

// Complex calculations that don't overflow
x = 2 ** 1023 - 2 ** 971 + 2 ** 1023;  // Large but finite
x = Math.pow(10, 308);  // Close to but not exceeding limit

// Dynamic calculations (runtime dependent)  
x = Math.pow(base, exponent);  // Values not known at compile time
x = userInput ** power;

/* ✗ BAD */
// Calculations that exceed JavaScript's number limits
x = 2 ** 1024;                    // Exceeds max safe exponent
x = 2 ** 1024 - 2 ** 971;         // Still overflows
x = 2 ** 1023 + 2 ** 1023;        // Addition overflow
x = 2 ** 1023 - 2 ** 970 + 2 ** 1023;  // Complex overflow

// Large number calculations that always overflow
x = 1.8e308;                      // Exceeds Number.MAX_VALUE
x = Number.MAX_VALUE * 2;         // Multiplication overflow
x = 1 / 0;                        // Division by zero
x = -1 / 0;                       // Negative division by zero
```

<!-- 
// Mathematical functions that produce infinity
x = Math.pow(10, 1000);           // Exponentiation overflow
x = Math.exp(1000);               // Exponential overflow
-->

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
