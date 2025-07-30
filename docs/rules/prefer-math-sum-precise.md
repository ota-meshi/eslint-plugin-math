---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-sum-precise"
description: "enforce the use of Math.sumPrecise() instead of other summation methods"
since: "v0.11.0"
---

# math/prefer-math-sum-precise

> enforce the use of Math.sumPrecise() instead of other summation methods

- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of [`Math.sumPrecise()`] instead of other summation methods.

[`Math.sumPrecise()`]: https://github.com/tc39/proposal-math-sum

`Math.sumPrecise()` addresses floating-point precision issues that occur with traditional summation approaches:

- **More precise algorithm**: Uses a more precise algorithm than naive summation
- **Consistency**: Standardized approach to precise summation
- **Performance**: Optimized implementation in the JavaScript engine

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-sum-precise: 'error' */
const values = [1.1, 2.2, 3.3];

/* ✓ GOOD */
// Using Math.sumPrecise for accurate summation
total = Math.sumPrecise(values);

/* ✗ BAD */
// Traditional reduce
total = values.reduce((a, b) => a + b, 0);

// Manual loop accumulation
let sum = 0;
for (const value of values) {
  sum += value;
}
total = sum;
```

</eslint-code-block>

## 🔧 Options

```json
{
  "math/abs": [
    "error",
    {
      "aggressive": false
    }
  ]
}
```

- `aggressive` ... configure the aggressive mode for only this rule. (default: `false`)

### The `aggressive` mode

This plugin never reports expressions with unknown type by default. Because it's hard to know the type of objects, it will cause false positives.

If you configured the `aggressive` mode, this plugin reports expressions with unknown type even if the rules couldn't know the type of operands.

## 📚 Further reading

- [Math.sumPrecise() proposal](https://github.com/tc39/proposal-math-sum)
- [MDN - Math.sumPrecise()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sumPrecise)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.11.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-sum-precise.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-sum-precise.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-sum-precise)
