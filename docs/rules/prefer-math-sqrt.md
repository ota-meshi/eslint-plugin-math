---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-sqrt"
description: "enforce the use of Math.sqrt() instead of other square root calculations"
---

# math/prefer-math-sqrt

> enforce the use of Math.sqrt() instead of other square root calculations

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>
- :gear: This rule is included in `"plugin:math/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule aims to enforce the use of `Math.sqrt()` instead of other square root calculations.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-sqrt: 'error' */

/* ✓ GOOD */
x = Math.sqrt(n);

/* ✗ BAD */
x = Math.pow(n, 1 / 2);
x = Math.pow(n, 0.5);
x = n ** (1 / 2);
x = n ** 0.5;
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [MDN - Math.sqrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)
- [MDN - Math.pow()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)
- [MDN - Exponentiation (`**`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-sqrt.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-sqrt.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-sqrt)
