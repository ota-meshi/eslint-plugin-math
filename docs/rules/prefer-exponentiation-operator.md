---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-exponentiation-operator"
description: "enforce the use of exponentiation (`**`) operator instead of other calculations"
since: "v0.6.0"
---

# math/prefer-exponentiation-operator

> enforce the use of exponentiation (`**`) operator instead of other calculations

- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of exponentiation (`**`) operator instead of other calculations.

The exponentiation operator (`**`) provides several advantages over alternatives:

- **Readability**: More concise and mathematically intuitive
- **Performance**: Often better optimized by JavaScript engines
- **Consistency**: Standard ES2016+ syntax for exponentiation
- **Type Safety**: Better behavior with edge cases compared to `Math.pow`

This rule was inspired by ESLint Core's [prefer-exponentiation-operator], but additionally detects multiplication with the same operands.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-exponentiation-operator: 'error' */

/* ✓ GOOD */
square = a ** 2;
cube = a ** 3;
power = a ** b;
squareRoot = a ** 0.5;
inverseSquare = a ** -2;

/* ✗ BAD */
square = Math.pow(a, 2);
cube = Math.pow(a, 3);
power = Math.pow(a, b);
squareRoot = Math.pow(a, 0.5);
inverseSquare = Math.pow(a, -2);

/* ✓ GOOD */
square = a ** 2;
cube = a ** 3;
fourthPower = a ** 4;

/* ✗ BAD */
square = a * a;
cube = a * a * a;
fourthPower = a * a * a * a;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Exponentiation (`**`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)
- [MDN - Math.pow()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)
- [MDN - Multiplication (`*`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Multiplication)

## 👫 Related rules

- [prefer-exponentiation-operator]

[prefer-exponentiation-operator]: https://eslint.org/docs/latest/rules/prefer-exponentiation-operator

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.6.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-exponentiation-operator.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-exponentiation-operator.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-exponentiation-operator)
