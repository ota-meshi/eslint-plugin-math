---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-cbrt"
description: "enforce the use of Math.cbrt() instead of other cube root calculations"
---

# math/prefer-math-cbrt

> enforce the use of Math.cbrt() instead of other cube root calculations

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>
- :gear: This rule is included in `"plugin:math/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule aims to enforce the use of `Math.cbrt()` instead of other cube root calculations.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-cbrt: 'error' */

/* ✓ GOOD */
x = Math.cbrt(n);

/* ✗ BAD */
x = Math.pow(n, 1 / 3);
x = n ** (1 / 3);
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-cbrt.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-cbrt.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-cbrt)