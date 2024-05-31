/* {} */
/**
 * These test cases were heavily inspired by ESLint test cases.
 * https://github.com/eslint/eslint/blob/main/tests/lib/rules/prefer-exponentiation-operator.js
 */

// parents with a higher precedence
x = +Math.pow(a, b);
x = -Math.pow(a, b);
x = !Math.pow(a, b);
x = typeof Math.pow(a, b);
x = void Math.pow(a, b);
x = Math.pow(a, b).toString();
x = Math.pow(a, b)();
x = Math.pow(a, b)``;
x = class extends Math.pow(a, b) {};
