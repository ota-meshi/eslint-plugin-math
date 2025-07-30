---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-trunc"
description: "enforce the use of Math.trunc() instead of other truncations"
since: "v0.1.0"
---

# math/prefer-math-trunc

> enforce the use of Math.trunc() instead of other truncations

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.trunc()` instead of other truncation methods for removing the fractional part of numbers.

`Math.trunc()` provides several advantages over alternative approaches:

- **Clarity of intent**: Immediately obvious that you're truncating to an integer
- **Simplicity**: Single function call instead of conditional logic
- **Consistency**: Standardized approach across all numeric ranges
- **Performance**: Optimized native implementation
- **Reliability**: Works correctly with all finite numbers, including very large values

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-trunc: 'error' */

/* ✓ GOOD */
x = Math.trunc(n);

/* ✗ BAD */
// Verbose conditional approach
x = n >= 0 ? Math.floor(n) : Math.ceil(n);

// Complex conditional statements
if (n >= 0) {
    x = Math.floor(n);
} else {
    x = Math.ceil(n);
}

// Bitwise operations (limited range and unclear intent)
x = ~~n;    // Same as Math.trunc(n) only if -(2³¹) - 1 < n < (2³¹)
x = n & -1; // Bitwise AND with -1
x = n | 0;  // Bitwise OR with 0
x = n ^ 0;  // Bitwise XOR with 0
x = n >> 0; // Right shift by 0
```

</eslint-code-block>

## 🔧 Options

```json
{
  "math/prefer-math-trunc": [
    "error",
    {
      "reportBitwise": true // false
    }
  ]
}
```

- `reportBitwise` ... If `true`, the rule reports bitwise operations that are equivalent to `Math.trunc()`. Defaults to `true`.

### `reportBitwise` (boolean)

- **Default**: `true`
- **Description**: Controls whether the rule reports bitwise operations that can be replaced with `Math.trunc()`

When `true`, the rule will flag bitwise operations like:

- `~~x` (double bitwise NOT)
- `x | 0` (bitwise OR with zero)
- `x >> 0` (right shift by zero)
- `x << 0` (left shift by zero)
- `x ^ 0` (bitwise XOR with zero)

When `false`, the rule only reports conditional expressions and other non-bitwise patterns.

#### Why Bitwise Operations Are Problematic

While bitwise operations can truncate numbers, they have significant limitations:

- **Limited range**: Only work correctly for 32-bit signed integers (approximately ±2.1 billion)
- **Unexpected behavior**: Large numbers get converted to different values
- **Poor readability**: Intent is not immediately clear
- **Platform dependency**: Behavior may vary across JavaScript engines

```js
// Demonstrating bitwise operation limitations
const largeNumber = 3000000000;

Math.trunc(largeNumber);  // 3000000000 (correct)
~~largeNumber;           // -1294967296 (wrong! 32-bit overflow)
largeNumber | 0;         // -1294967296 (wrong! 32-bit overflow)
```

## 📚 Further reading

- [MDN - Math.trunc()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc)
- [MDN - Math.floor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)
- [MDN - Math.ceil()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil)
- [MDN - Bitwise NOT (`~`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT)
- [MDN - Bitwise AND (`&`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)
- [MDN - Bitwise OR (`|`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR)
- [MDN - Bitwise XOR (`^`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR)
- [MDN - Right shift (`>>`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.1.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-trunc.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-trunc.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-trunc)
