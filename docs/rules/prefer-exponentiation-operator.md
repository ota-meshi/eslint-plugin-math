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

This rule was inspired by ESLint Core's [prefer-exponentiation-operator], but additionally detects multiplication with the same operands.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-exponentiation-operator: 'error' */

/* ✓ GOOD */
x = a ** b;

/* ✗ BAD */
x = Math.pow(a, b);

/* ✓ GOOD */
x = a ** 3;

/* ✗ BAD */
x = a * a * a;
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
