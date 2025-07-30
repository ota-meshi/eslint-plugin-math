---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-cbrt"
description: "enforce the use of Math.cbrt() instead of other cube root calculations"
since: "v0.3.0"
---

# math/prefer-math-cbrt

> enforce the use of Math.cbrt() instead of other cube root calculations

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.cbrt()` instead of other cube root calculations.

`Math.cbrt()` provides several advantages over manual exponentiation:

- **Clarity of intent**: Immediately obvious that you're calculating a cube root
- **Performance**: Optimized native implementation for cube root calculations
- **Precision**: More accurate for edge cases and special values
- **Readability**: Shorter and more expressive than exponentiation syntax
- **Consistency**: Part of the ES2015 Math API family

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-cbrt: 'error' */

/* ✓ GOOD */
// Using Math.cbrt for clarity and performance
cubeRoot = Math.cbrt(volume);
scaleFactor = Math.cbrt(ratio);
dimension = Math.cbrt(8); // = 2

// In geometric calculations
sideLength = Math.cbrt(cubeVolume);
linearScale = Math.cbrt(volumeRatio);

/* ✗ BAD */
// Using Math.pow with fractional exponent
cubeRoot = Math.pow(volume, 1 / 3);
scaleFactor = Math.pow(ratio, 1/3);

// Using exponentiation operator
dimension = 8 ** (1 / 3);
sideLength = cubeVolume ** (1/3);
```

</eslint-code-block>

### Important Edge Case Behavior

Note that the results are different when the input is `-Infinity`:

```js
Math.cbrt(-Infinity)        // -Infinity
Math.pow(-Infinity, 1/3)    // Infinity
(-Infinity) ** (1/3)        // Infinity
```

If you do not use `-Infinity` in your calculations, it is a safe replacement. For most practical applications involving real numbers, `Math.cbrt()` provides the expected mathematical behavior.

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.cbrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt)
- [MDN - Math.pow()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)
- [MDN - Exponentiation (`**`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.3.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-cbrt.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-cbrt.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-cbrt)
