# User Guide

## :cd: Installation

```bash
npm install --save-dev eslint eslint-plugin-math
```

::: tip Requirements

- ESLint v8.57.0 and above
- Node.js v18.x, v20.x and above
:::

## :book: Usage

<!--USAGE_GUIDE_START-->

### Configuration

#### New Config (`eslint.config.js`)

Use `eslint.config.js` file to configure rules. See also: <https://eslint.org/docs/latest/use/configure/configuration-files-new>.

Example **eslint.config.js**:

```mjs
import eslintPluginMath from 'eslint-plugin-math';
export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  eslintPluginMath.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // 'math/rule-name': 'error'
    }
  }
];
```

This plugin provides configs:

- `*.configs.recommended` ... Recommended config provided by the plugin.

See [the rule list](../rules/index.md) to get the `rules` that this plugin provides.

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
    // 'math/rule-name': 'error'
  }
}
```

This plugin provides configs:

- `plugin:math/recommended-legacy` ... Recommended config provided by the plugin.

See [the rule list](../rules/index.md) to get the `rules` that this plugin provides.

<!--USAGE_GUIDE_END-->

## :question: FAQ

- TODO
