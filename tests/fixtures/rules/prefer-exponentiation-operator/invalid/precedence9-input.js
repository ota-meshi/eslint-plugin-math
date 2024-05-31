/* {} */
/**
 * These test cases were heavily inspired by ESLint test cases.
 * https://github.com/eslint/eslint/blob/main/tests/lib/rules/prefer-exponentiation-operator.js
 */

// tokens that cannot be adjacent
x = a + Math.pow(++b, c);
x = Math.pow(a, b) in c;
x = a + Math.pow(++b, c) in d;
x = a + Math.pow(++b, c) in d;
