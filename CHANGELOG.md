# eslint-plugin-math

## 0.11.0

### Minor Changes

- [#118](https://github.com/ota-meshi/eslint-plugin-math/pull/118) [`72a9181`](https://github.com/ota-meshi/eslint-plugin-math/commit/72a91813fb6f6a35fdd41230992d6df9c058b5bd) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-sum-precise` rule

## 0.10.1

### Patch Changes

- [#109](https://github.com/ota-meshi/eslint-plugin-math/pull/109) [`b9fd0be`](https://github.com/ota-meshi/eslint-plugin-math/commit/b9fd0be9b2dad3a83bddd4fdc34114e1f0e68894) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update dependency eslint-type-tracer to ^0.3.0

## 0.10.0

### Minor Changes

- [#107](https://github.com/ota-meshi/eslint-plugin-math/pull/107) [`8b938d2`](https://github.com/ota-meshi/eslint-plugin-math/commit/8b938d26649e9d6847e0ec383c84082f0b2e52b6) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: refactor to use eslint-type-tracer

## 0.9.0

### Minor Changes

- [#105](https://github.com/ota-meshi/eslint-plugin-math/pull/105) [`87fe73a`](https://github.com/ota-meshi/eslint-plugin-math/commit/87fe73af13d700e9cf74530ec0cc07769b22ed6d) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat(prefer-math-trunc): add `reportBitwise` option

## 0.8.0

### Minor Changes

- [#102](https://github.com/ota-meshi/eslint-plugin-math/pull/102) [`beddad1`](https://github.com/ota-meshi/eslint-plugin-math/commit/beddad1576cc779c0bdd167f9677ff965bdb01c3) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat(abs): if operand is number, replace the negative expression with `abs()`

- [#104](https://github.com/ota-meshi/eslint-plugin-math/pull/104) [`84bf7b3`](https://github.com/ota-meshi/eslint-plugin-math/commit/84bf7b318c42e733dd22886b425ff48cc6e79737) Thanks [@ota-meshi](https://github.com/ota-meshi)! - BREAKING(abs): change default to `prefer: Math.abs`

## 0.7.0

### Minor Changes

- [#94](https://github.com/ota-meshi/eslint-plugin-math/pull/94) [`807e7a4`](https://github.com/ota-meshi/eslint-plugin-math/commit/807e7a46daccc20153bacbacd2aa87feb5b76fa3) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: `math/prefer-number-min-value` rule

## 0.6.4

### Patch Changes

- [#95](https://github.com/ota-meshi/eslint-plugin-math/pull/95) [`e1fe13b`](https://github.com/ota-meshi/eslint-plugin-math/commit/e1fe13b1320539cac884c1d598fff39746e244cb) Thanks [@ota-meshi](https://github.com/ota-meshi)! - fix(prefer-math-trunc): stop autofixing bitwise expressions and replace them with suggestions

## 0.6.3

### Patch Changes

- [#89](https://github.com/ota-meshi/eslint-plugin-math/pull/89) [`074a0d4`](https://github.com/ota-meshi/eslint-plugin-math/commit/074a0d4ae88aaca59f5ea23fb3f40ad2f465cecd) Thanks [@ota-meshi](https://github.com/ota-meshi)! - fix(prefer-exponentiation-operator): incorrect message

## 0.6.2

### Patch Changes

- [#86](https://github.com/ota-meshi/eslint-plugin-math/pull/86) [`e4c31f3`](https://github.com/ota-meshi/eslint-plugin-math/commit/e4c31f3dde12a81175d29320610f4984734cac4d) Thanks [@ota-meshi](https://github.com/ota-meshi)! - fix(no-static-\*): false positive for ts expression

## 0.6.1

### Patch Changes

- [#77](https://github.com/ota-meshi/eslint-plugin-math/pull/77) [`c72cfd9`](https://github.com/ota-meshi/eslint-plugin-math/commit/c72cfd94350209c5326a116ff5c33a088be66972) Thanks [@ota-meshi](https://github.com/ota-meshi)! - update tsup config

## 0.6.0

### Minor Changes

- [#28](https://github.com/ota-meshi/eslint-plugin-math/pull/28) [`31d915a`](https://github.com/ota-meshi/eslint-plugin-math/commit/31d915a64c49ffd8c6be52a083dc2b81c0e8f1bb) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-exponentiation-operator` rule

- [#28](https://github.com/ota-meshi/eslint-plugin-math/pull/28) [`31d915a`](https://github.com/ota-meshi/eslint-plugin-math/commit/31d915a64c49ffd8c6be52a083dc2b81c0e8f1bb) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-hypot` rule

- [#28](https://github.com/ota-meshi/eslint-plugin-math/pull/28) [`31d915a`](https://github.com/ota-meshi/eslint-plugin-math/commit/31d915a64c49ffd8c6be52a083dc2b81c0e8f1bb) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: improve message

### Patch Changes

- [#28](https://github.com/ota-meshi/eslint-plugin-math/pull/28) [`31d915a`](https://github.com/ota-meshi/eslint-plugin-math/commit/31d915a64c49ffd8c6be52a083dc2b81c0e8f1bb) Thanks [@ota-meshi](https://github.com/ota-meshi)! - fix: wrong auto-fix for precedence in`math/abs` rule

## 0.5.0

### Minor Changes

- [#26](https://github.com/ota-meshi/eslint-plugin-math/pull/26) [`1c15882`](https://github.com/ota-meshi/eslint-plugin-math/commit/1c1588227e8949e9b867d11822abe4337aca5d26) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/no-static-infinity-calculations` rule

- [#26](https://github.com/ota-meshi/eslint-plugin-math/pull/26) [`1c15882`](https://github.com/ota-meshi/eslint-plugin-math/commit/1c1588227e8949e9b867d11822abe4337aca5d26) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/no-static-nan-calculations` rule

- [#26](https://github.com/ota-meshi/eslint-plugin-math/pull/26) [`1c15882`](https://github.com/ota-meshi/eslint-plugin-math/commit/1c1588227e8949e9b867d11822abe4337aca5d26) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-e` rule

- [#26](https://github.com/ota-meshi/eslint-plugin-math/pull/26) [`1c15882`](https://github.com/ota-meshi/eslint-plugin-math/commit/1c1588227e8949e9b867d11822abe4337aca5d26) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-pi` rule

- [#26](https://github.com/ota-meshi/eslint-plugin-math/pull/26) [`1c15882`](https://github.com/ota-meshi/eslint-plugin-math/commit/1c1588227e8949e9b867d11822abe4337aca5d26) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-number-epsilon` rule

- [#26](https://github.com/ota-meshi/eslint-plugin-math/pull/26) [`1c15882`](https://github.com/ota-meshi/eslint-plugin-math/commit/1c1588227e8949e9b867d11822abe4337aca5d26) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-number-max-value` rule

- [#24](https://github.com/ota-meshi/eslint-plugin-math/pull/24) [`1331d90`](https://github.com/ota-meshi/eslint-plugin-math/commit/1331d9072a08b0e9dece17ce595901285f080dcc) Thanks [@ota-meshi](https://github.com/ota-meshi)! - refactor

## 0.4.0

### Minor Changes

- [#20](https://github.com/ota-meshi/eslint-plugin-math/pull/20) [`0de1773`](https://github.com/ota-meshi/eslint-plugin-math/commit/0de1773f3356ca0d6a38fdc9e4d27b283a44618a) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-number-is-nan` rule

- [#22](https://github.com/ota-meshi/eslint-plugin-math/pull/22) [`8af8d45`](https://github.com/ota-meshi/eslint-plugin-math/commit/8af8d4574ff3ee80082529d2067b346ea4d30fa4) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-ln10` rule

- [#20](https://github.com/ota-meshi/eslint-plugin-math/pull/20) [`0de1773`](https://github.com/ota-meshi/eslint-plugin-math/commit/0de1773f3356ca0d6a38fdc9e4d27b283a44618a) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-ln2` rule

- [#22](https://github.com/ota-meshi/eslint-plugin-math/pull/22) [`8af8d45`](https://github.com/ota-meshi/eslint-plugin-math/commit/8af8d4574ff3ee80082529d2067b346ea4d30fa4) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-log10` rule

- [#22](https://github.com/ota-meshi/eslint-plugin-math/pull/22) [`8af8d45`](https://github.com/ota-meshi/eslint-plugin-math/commit/8af8d4574ff3ee80082529d2067b346ea4d30fa4) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-log10e` rule

- [#20](https://github.com/ota-meshi/eslint-plugin-math/pull/20) [`0de1773`](https://github.com/ota-meshi/eslint-plugin-math/commit/0de1773f3356ca0d6a38fdc9e4d27b283a44618a) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-log2` rule

- [#20](https://github.com/ota-meshi/eslint-plugin-math/pull/20) [`0de1773`](https://github.com/ota-meshi/eslint-plugin-math/commit/0de1773f3356ca0d6a38fdc9e4d27b283a44618a) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-log2e` rule

- [#20](https://github.com/ota-meshi/eslint-plugin-math/pull/20) [`0de1773`](https://github.com/ota-meshi/eslint-plugin-math/commit/0de1773f3356ca0d6a38fdc9e4d27b283a44618a) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-sqrt1-2` rule

- [#20](https://github.com/ota-meshi/eslint-plugin-math/pull/20) [`0de1773`](https://github.com/ota-meshi/eslint-plugin-math/commit/0de1773f3356ca0d6a38fdc9e4d27b283a44618a) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-sqrt2` rule

- [#20](https://github.com/ota-meshi/eslint-plugin-math/pull/20) [`0de1773`](https://github.com/ota-meshi/eslint-plugin-math/commit/0de1773f3356ca0d6a38fdc9e4d27b283a44618a) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-number-is-finite` rule

## 0.3.0

### Minor Changes

- [#16](https://github.com/ota-meshi/eslint-plugin-math/pull/16) [`b551c8c`](https://github.com/ota-meshi/eslint-plugin-math/commit/b551c8caddc5939003fc2af37e220ce69579eac3) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-sqrt` rule

- [#16](https://github.com/ota-meshi/eslint-plugin-math/pull/16) [`b551c8c`](https://github.com/ota-meshi/eslint-plugin-math/commit/b551c8caddc5939003fc2af37e220ce69579eac3) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-math-cbrt` rule

- [#19](https://github.com/ota-meshi/eslint-plugin-math/pull/19) [`8321096`](https://github.com/ota-meshi/eslint-plugin-math/commit/83210969c4d101ead0f47febbf17a1781959be67) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-number-max-safe-integer` rule

- [#19](https://github.com/ota-meshi/eslint-plugin-math/pull/19) [`8321096`](https://github.com/ota-meshi/eslint-plugin-math/commit/83210969c4d101ead0f47febbf17a1781959be67) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-number-min-safe-integer` rule

- [#17](https://github.com/ota-meshi/eslint-plugin-math/pull/17) [`dc269c1`](https://github.com/ota-meshi/eslint-plugin-math/commit/dc269c1faf7cf110b0cf152b0f76168dfd0b8106) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: improve `math/prefer-math-trunc`

- [#19](https://github.com/ota-meshi/eslint-plugin-math/pull/19) [`8321096`](https://github.com/ota-meshi/eslint-plugin-math/commit/83210969c4d101ead0f47febbf17a1781959be67) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-number-is-safe-integer` rule

- [#19](https://github.com/ota-meshi/eslint-plugin-math/pull/19) [`8321096`](https://github.com/ota-meshi/eslint-plugin-math/commit/83210969c4d101ead0f47febbf17a1781959be67) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/abs` rule

- [#14](https://github.com/ota-meshi/eslint-plugin-math/pull/14) [`75ce300`](https://github.com/ota-meshi/eslint-plugin-math/commit/75ce3008189c404c1191fe60c068db43cdc917dd) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: improve `math/prefer-number-is-integer`

## 0.2.0

### Minor Changes

- [#8](https://github.com/ota-meshi/eslint-plugin-math/pull/8) [`6b71c36`](https://github.com/ota-meshi/eslint-plugin-math/commit/6b71c360b7ed3a186491c0e4551c57a0812ff5dc) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add `math/prefer-number-is-integer` rule

## 0.1.0

### Minor Changes

- [#1](https://github.com/ota-meshi/eslint-plugin-math/pull/1) [`3c83a30`](https://github.com/ota-meshi/eslint-plugin-math/commit/3c83a30f4c20f111f74db5f8e9bd2e0fce3b0623) Thanks [@ota-meshi](https://github.com/ota-meshi)! - Implements eslint-plugin-math
