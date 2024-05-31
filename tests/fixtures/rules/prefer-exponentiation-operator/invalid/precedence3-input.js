/* {} */
/**
 * These test cases were heavily inspired by ESLint test cases.
 * https://github.com/eslint/eslint/blob/main/tests/lib/rules/prefer-exponentiation-operator.js
 */

// parents with a lower precedence
x = a * Math.pow(b, c);
x = Math.pow(a, b) * c;
x = a + Math.pow(b, c);
x = Math.pow(a, b) / c;
x = a < Math.pow(b, c);
x = Math.pow(a, b) > c;
x = a === Math.pow(b, c);
x = a ? Math.pow(b, c) : d;
x = a = Math.pow(b, c);
x = a += Math.pow(b, c);
x = function* f() {
  yield Math.pow(a, b);
};
x = (a, Math.pow(b, c), d);
