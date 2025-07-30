---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-hypot"
description: "enforce the use of Math.hypot() instead of other hypotenuse calculations"
since: "v0.6.0"
---

# math/prefer-math-hypot

> enforce the use of Math.hypot() instead of other hypotenuse calculations

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.hypot()` instead of other hypotenuse calculations.

`Math.hypot()` provides several advantages over manual Pythagorean theorem calculations:

- **Overflow protection**: Avoids intermediate overflow when dealing with large numbers
- **Underflow protection**: Prevents precision loss with very small numbers
- **Numerical stability**: Uses algorithms optimized for floating-point arithmetic
- **Clarity**: Expresses the mathematical intent more clearly
- **Variable arguments**: Supports any number of dimensions, not just 2D

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-hypot: 'error' */

/* ✓ GOOD */
// 2D distance calculation
distance2D = Math.hypot(x2 - x1, y2 - y1);

// 3D distance calculation  
distance3D = Math.hypot(x2 - x1, y2 - y1, z2 - z1);

// Vector magnitude
magnitude = Math.hypot(vector.x, vector.y, vector.z);

// Complex number absolute value
complexAbs = Math.hypot(real, imaginary);

// Root mean square
rms = Math.hypot(...values) / Math.sqrt(values.length);

/* ✗ BAD */
// Manual 2D calculation (overflow/underflow risk)
distance2D = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
distance2D_alt = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

// Manual 3D calculation (more complex, error-prone)
distance3D = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

// Verbose exponentiation
magnitude = (vector.x ** 2 + vector.y ** 2 + vector.z ** 2) ** 0.5;

// Mixed operators (harder to read)
complexAbs = Math.sqrt(Math.pow(real, 2) + Math.pow(imaginary, 2));
```

</eslint-code-block>

### The Numerical Stability Problem

Manual calculations can suffer from overflow/underflow issues:

```js
// These can overflow with large numbers
const large = 1e200;
Math.sqrt(large * large + large * large)  // Infinity (overflow)

// Math.hypot handles this correctly
Math.hypot(large, large)  // 1.4142135623730951e+200 (correct)

// Similarly for very small numbers (underflow)
const small = 1e-200;
Math.sqrt(small * small + small * small)  // 0 (underflow)
Math.hypot(small, small)  // 1.4142135623730951e-200 (correct)
```

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.hypot()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot)
- [MDN - Math.sqrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)
- [MDN - Exponentiation (`**`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)
- [MDN - Math.pow()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.6.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-hypot.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-hypot.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-hypot)
