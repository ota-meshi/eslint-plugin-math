# Introduction

[eslint-plugin-math](https://www.npmjs.com/package/eslint-plugin-math) is ESLint plugin related to [Math] object and [Number].

[![NPM license](https://img.shields.io/npm/l/eslint-plugin-math.svg)](https://www.npmjs.com/package/eslint-plugin-math)
[![NPM version](https://img.shields.io/npm/v/eslint-plugin-math.svg)](https://www.npmjs.com/package/eslint-plugin-math)
[![NPM downloads](https://img.shields.io/badge/dynamic/json.svg?label=downloads&colorB=green&suffix=/day&query=$.downloads&uri=https://api.npmjs.org//downloads/point/last-day/eslint-plugin-math&maxAge=3600)](http://www.npmtrends.com/eslint-plugin-math)
[![NPM downloads](https://img.shields.io/npm/dw/eslint-plugin-math.svg)](http://www.npmtrends.com/eslint-plugin-math)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-math.svg)](http://www.npmtrends.com/eslint-plugin-math)
[![NPM downloads](https://img.shields.io/npm/dy/eslint-plugin-math.svg)](http://www.npmtrends.com/eslint-plugin-math)
[![NPM downloads](https://img.shields.io/npm/dt/eslint-plugin-math.svg)](http://www.npmtrends.com/eslint-plugin-math)
[![Build Status](https://github.com/ota-meshi/eslint-plugin-math/actions/workflows/NodeCI.yml/badge.svg?branch=main)](https://github.com/ota-meshi/eslint-plugin-math/actions/workflows/NodeCI.yml)

## :name_badge: Features

ESLint plugin related to [Math] object and [Number].

You can check on the [Online DEMO](https://ota-meshi.github.io/eslint-plugin-math/playground/).

<!--DOCS_IGNORE_START-->

## :book: Documentation

See [documents](https://ota-meshi.github.io/eslint-plugin-math/).

## :cd: Installation

```bash
npm install --save-dev eslint eslint-plugin-math
```

> **Requirements**
>
> - ESLint v8.57.0 and above
> - Node.js v18.x, v20.x and above

<!--DOCS_IGNORE_END-->

## :book: Usage

<!--USAGE_SECTION_START-->
<!--USAGE_GUIDE_START-->

### Configuration

#### New Config (`eslint.config.js`)

Use `eslint.config.js` file to configure rules. See also: <https://eslint.org/docs/latest/use/configure/configuration-files-new>.

Example **eslint.config.js**:

```js
import eslintPluginMath from 'eslint-plugin-math';
export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  eslintPluginMath.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // 'math/prefer-math-trunc': 'error'
    }
  }
];
```

This plugin provides configs:

- `*.configs.recommended` ... Recommended config provided by the plugin.

See [the rule list](https://ota-meshi.github.io/eslint-plugin-math/rules/) to get the `rules` that this plugin provides.

#### Legacy Config (`.eslintrc`)

Use `.eslintrc.*` file to configure rules. See also: <https://eslint.org/docs/latest/use/configure/>.

Example **.eslintrc.js**:

```js
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:math/recommended-legacy'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'math/prefer-math-trunc': 'error'
  }
}
```

This plugin provides configs:

- `plugin:math/recommended-legacy` ... Recommended config provided by the plugin.

See [the rule list](https://ota-meshi.github.io/eslint-plugin-math/rules/) to get the `rules` that this plugin provides.

<!--USAGE_GUIDE_END-->
<!--USAGE_SECTION_END-->

## :white_check_mark: Rules

<!--RULES_SECTION_START-->

The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) automatically fixes problems reported by rules which have a wrench :wrench: below.  
The rules with the following star :star: are included in the configs.

<!--RULES_TABLE_START-->

### Math Rules

| Rule ID | Description | Fixable | RECOMMENDED |
|:--------|:------------|:-------:|:-----------:|
| [math/abs](https://ota-meshi.github.io/eslint-plugin-math/rules/abs.html) | enforce the conversion to absolute values to be the method you prefer | :wrench: |  |
| [math/prefer-math-cbrt](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-math-cbrt.html) | enforce the use of Math.cbrt() instead of other cube root calculations | :wrench: | :star: |
| [math/prefer-math-ln2](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-math-ln2.html) | enforce the use of Math.LN2 instead of other ways | :wrench: | :star: |
| [math/prefer-math-log10](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-math-log10.html) | enforce the use of Math.log10() instead of other calculation methods. | :wrench: | :star: |
| [math/prefer-math-log2](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-math-log2.html) | enforce the use of Math.log2() instead of other calculation methods. | :wrench: | :star: |
| [math/prefer-math-log2e](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-math-log2e.html) | enforce the use of Math.LOG2E instead of other ways | :wrench: | :star: |
| [math/prefer-math-sqrt](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-math-sqrt.html) | enforce the use of Math.sqrt() instead of other square root calculations | :wrench: | :star: |
| [math/prefer-math-sqrt1-2](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-math-sqrt1-2.html) | enforce the use of Math.SQRT1_2 instead of other ways | :wrench: | :star: |
| [math/prefer-math-sqrt2](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-math-sqrt2.html) | enforce the use of Math.SQRT2 instead of other ways | :wrench: | :star: |
| [math/prefer-math-trunc](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-math-trunc.html) | enforce the use of Math.trunc() instead of other truncations | :wrench: | :star: |
| [math/prefer-number-is-finite](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-number-is-finite.html) | enforce the use of Number.isFinite() instead of other checking ways | :wrench: | :star: |
| [math/prefer-number-is-integer](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-number-is-integer.html) | enforce the use of Number.isInteger() instead of other checking ways | :wrench: | :star: |
| [math/prefer-number-is-nan](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-number-is-nan.html) | enforce the use of Number.isNaN() instead of other checking ways | :wrench: | :star: |
| [math/prefer-number-is-safe-integer](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-number-is-safe-integer.html) | enforce the use of Number.isSafeInteger() instead of other checking ways | :wrench: | :star: |
| [math/prefer-number-max-safe-integer](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-number-max-safe-integer.html) | enforce the use of Number.MAX_SAFE_INTEGER instead of other ways | :wrench: | :star: |
| [math/prefer-number-min-safe-integer](https://ota-meshi.github.io/eslint-plugin-math/rules/prefer-number-min-safe-integer.html) | enforce the use of Number.MIN_SAFE_INTEGER instead of other ways | :wrench: | :star: |

<!--RULES_TABLE_END-->
<!--RULES_SECTION_END-->

<!--DOCS_IGNORE_START-->

## :beers: Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

### Development Tools

- `npm test` runs tests and measures coverage.  
- `npm run update` runs in order to update readme and recommended configuration.  

## :lock: License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).

[Math]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
