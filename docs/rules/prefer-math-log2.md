---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-log2"
description: "enforce the use of Math.log2() instead of other calculation methods."
---

# math/prefer-math-log2

> enforce the use of Math.log2() instead of other calculation methods.

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>
- :gear: This rule is included in `"plugin:math/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule aims to enforce the use of `Math.log2()` instead of other calculation methods.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-log2: 'error' */

/* ✓ GOOD */
x = Math.log2(n);

/* ✗ BAD */
x = Math.log(n) * Math.LOG2E;
x = Math.log(n) / Math.LN2;
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [MDN - Math.log2()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2)
- [MDN - Math.log()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log)
- [MDN - Math.LOG2E](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG2E)
- [MDN - Math.LN2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2)

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-log2.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-log2.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-log2)
