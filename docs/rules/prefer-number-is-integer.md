---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-number-is-integer"
description: "enforce the use of Number.isInteger() instead of other checking ways"
since: "v0.2.0"
---

# math/prefer-number-is-integer

> enforce the use of Number.isInteger() instead of other checking ways

- :gear: This rule is included in `"plugin:math/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule aims to enforce the use of `Number.isInteger()` instead of other checking ways.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-number-is-integer: 'error' */

/* ✓ GOOD */
x = Number.isInteger(n);

/* ✗ BAD */
x = Math.floor(n) === n;
x = Math.ceil(n) === n;
x = Math.trunc(n) === n;

z = n % 1 ? a : b;
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-math v0.2.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-number-is-integer.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-number-is-integer.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-number-is-integer)
