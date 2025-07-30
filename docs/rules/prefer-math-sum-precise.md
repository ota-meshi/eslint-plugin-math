---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-sum-precise"
description: "enforce the use of Math.sumPrecise() instead of other summation methods"
---

# math/prefer-math-sum-precise

> enforce the use of Math.sumPrecise() instead of other summation methods

- ❗ <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of [`Math.sumPrecise()`] instead of other ways.

[`Math.sumPrecise()`]: https://github.com/tc39/proposal-math-sum

<eslint-code-block>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-sum-precise: 'error' */

/* ✓ GOOD */
x = Math.sumPrecise([1, 2, 3]);

/* ✗ BAD */
x = [1, 2, 3].reduce((a, b) => a + b, 0);
let sum = 0;
for (const value of [1, 2, 3]) {
  sum += value;
}
x = sum;
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

## The `aggressive` mode

This plugin never reports expressions with unknown type by default. Because it's hard to know the type of objects, it will cause false positives.

If you configured the `aggressive` mode, this plugin reports expressions with unknown type even if the rules couldn't know the type of operands.

## 📚 Further reading

- [Math.sumPrecise() proposal](https://github.com/tc39/proposal-math-sum)
- [MDN - Math.sumPrecise()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sumPrecise)

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-sum-precise.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-sum-precise.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-sum-precise)
