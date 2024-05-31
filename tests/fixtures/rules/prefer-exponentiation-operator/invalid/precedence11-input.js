/* {} */
/**
 * These test cases were heavily inspired by ESLint test cases.
 * https://github.com/eslint/eslint/blob/main/tests/lib/rules/prefer-exponentiation-operator.js
 */

// tokens that cannot be adjacent, but the autofix inserts parens required for precedence, so there is no need for an extra space
x = +Math.pow(++a, b);
x = Math.pow(a, b + c) in d;
