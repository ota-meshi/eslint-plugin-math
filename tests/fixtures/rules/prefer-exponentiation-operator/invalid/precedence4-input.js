/* {} */
/**
 * These test cases were heavily inspired by ESLint test cases.
 * https://github.com/eslint/eslint/blob/main/tests/lib/rules/prefer-exponentiation-operator.js
 */

// '**' is right-associative, that applies to both parent and child nodes
x = a ** Math.pow(b, c);
x = Math.pow(a, b) ** c;
x = Math.pow(a, b ** c);
x = Math.pow(a ** b, c);
x = a ** (Math.pow(b ** c, d ** e) ** f);
