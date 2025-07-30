---
pageClass: "rule-details"
sidebarDepth: 0
title: "math/prefer-math-ln2"
description: "enforce the use of Math.LN2 instead of other ways"
since: "v0.4.0"
---

# math/prefer-math-ln2

> enforce the use of Math.LN2 instead of other ways

- ⚙️ This rule is included in `"plugin:math/recommended"`.
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.
- 💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## 📖 Rule Details

This rule aims to enforce the use of `Math.LN2` instead of other ways to represent the natural logarithm of 2.

`Math.LN2` provides several advantages over manual calculations:

- **Clarity of intent**: Immediately obvious that you're using the natural logarithm of 2
- **Precision**: Provides the most accurate representation available in JavaScript
- **Performance**: Direct constant access instead of function call overhead
- **Consistency**: Part of the standardized Math constants family
- **Reliability**: Eliminates potential computational errors from manual calculations

<eslint-code-block fix>

<!-- eslint-skip -->

```js
/* eslint math/prefer-math-ln2: 'error' */

/* ✓ GOOD */
// Using Math.LN2 for logarithmic conversions
x = Math.LN2;

/* ✗ BAD */
// Using Math.log function call
x = Math.log(2);

// Using mathematical relationship
x = 1 / Math.LOG2E;

/* ✓ GOOD */
x = y * Math.LN2;

/* ✗ BAD */
x = y / Math.LOG2E;
```

</eslint-code-block>

## 🔧 Options

Nothing.

## 📚 Further reading

- [MDN - Math.LN2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2)
- [MDN - Math.log()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log)
- [MDN - Math.LOG2E](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG2E)

## 🚀 Version

This rule was introduced in eslint-plugin-math v0.4.0

## 🔍 Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/src/rules/prefer-math-ln2.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-math/blob/main/tests/src/rules/prefer-math-ln2.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-math/tree/main/tests/fixtures/rules/prefer-math-ln2)
