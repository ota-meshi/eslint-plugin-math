---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/abs"
description: "enforce the conversion to absolute values to be the method you prefer"
since: "v0.3.0"
---

# math/abs

> enforce the conversion to absolute values to be the method you prefer

- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the conversion to absolute values to be the method you prefer.

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/abs: ["error", {"prefer": "expression"}] */

/* ✓ GOOD */
x = n < 0 ? -n : n;

/* ✗ BAD */
x = Math.abs(n);
x = n < 0 ? n * -1 : n;
```

</eslint-code-block>

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/abs: ["error", {"prefer": "Math.abs"}] */

/* ✓ GOOD */
x = Math.abs(n);

/* ✗ BAD */
x = n < 0 ? n * -1 : n;

/* Ignore */
x = n < 0 ? -n : n; // `n` may be a `BigInt`, so we cannot replace it with `Math.abs(n)`.
```

</eslint-code-block>

## 🔧 Options

```json
{
  "math/abs": [
    "error",
    {
      "prefer": "expression" // or "Math.abs"
    }
  ]
}
```

- `"prefer"` ... enforces the conversion to absolute values to be the method you prefer. (default: `"expression"`)
  - `"expression"` ... enforces the conversion to absolute values to be the expression `n < 0 ? -n : n`.
  - `"Math.abs"` ... enforces the conversion to absolute values to be the method `Math.abs(n)`.

## 📚 Further reading

- [MDN - Math.abs()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.3.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/abs.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/abs.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/abs)
