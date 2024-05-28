---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-sqrt2"
description: "enforce the use of Math.SQRT2 instead of other ways"
---

# math/prefer-math-sqrt2

> enforce the use of Math.SQRT2 instead of other ways

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>
- :gear: This rule is included in `"plugin:math/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule aims to enforces the use of `Math.SQRT2` instead of other ways.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-sqrt2: 'error' */

/* ✓ GOOD */
x = Math.SQRT2;

/* ✗ BAD */
x = Math.sqrt(2);
x = 2 ** (1 / 2);
x = 2 ** 0.5;
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [MDN - Math.SQRT2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT2)
- [MDN - Math.sqrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-sqrt2.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-sqrt2.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-sqrt2)
