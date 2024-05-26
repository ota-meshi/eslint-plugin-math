---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-trunc"
description: "enforce use of Math.trunc() over other truncations"
since: "v0.1.0"
---

# math/prefer-math-trunc

> enforce use of Math.trunc() over other truncations

- :gear: This rule is included in `"plugin:math/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule aims to enforce use of `Math.trunc()` over other truncations.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-trunc: 'error' */

/* ✓ GOOD */
x = Math.trunc(n);

/* ✗ BAD */
x = n >= 0 ? Math.floor(n) : Math.ceil(n);
// Not strictly equivalent to Math.trunc(n).
x = ~~n;
x = n & -1;
x = n | 0;
x = n ^ 0;
x = n >> 0;

if (n >= 0) {
    x = Math.floor(n);
} else {
    x = Math.ceil(n);
}
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-math v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-trunc.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-trunc.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-trunc)
