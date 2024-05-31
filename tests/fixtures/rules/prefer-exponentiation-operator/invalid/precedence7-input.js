/* {} */
/**
 * These test cases were heavily inspired by ESLint test cases.
 * https://github.com/eslint/eslint/blob/main/tests/lib/rules/prefer-exponentiation-operator.js
 */

// base and exponent with a lower precedence
x = Math.pow(a * b, c);
x = Math.pow(a, b * c);
x = Math.pow(a / b, c);
x = Math.pow(a, b / c);
x = Math.pow(a + b, 3);
x = Math.pow(2, a - b);
x = Math.pow(a + b, c + d);
x = Math.pow((a = b), (c = d));
x = Math.pow((a += b), (c -= d));
x = Math.pow((a, b), (c, d));
x = function* f() {
  Math.pow(yield, yield);
};
