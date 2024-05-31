/* {} */
/**
 * These test cases were heavily inspired by ESLint test cases.
 * https://github.com/eslint/eslint/blob/main/tests/lib/rules/prefer-exponentiation-operator.js
 */

// doesn't remove already existing unnecessary parens around the whole expression
x = Math.pow(a, b);
x = foo + Math.pow(a, b);
x = Math.pow(a, b) + foo;
x = `${Math.pow(a, b)}`;
