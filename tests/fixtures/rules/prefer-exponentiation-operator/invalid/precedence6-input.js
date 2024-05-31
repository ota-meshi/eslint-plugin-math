/* {} */
/**
 * These test cases were heavily inspired by ESLint test cases.
 * https://github.com/eslint/eslint/blob/main/tests/lib/rules/prefer-exponentiation-operator.js
 */

// unary expressions are exception by the language - parens are required for the base to disambiguate operator precedence
x = Math.pow(+a, b);
x = Math.pow(a, +b);
x = Math.pow(-a, b);
x = Math.pow(a, -b);
x = Math.pow(-2, 3);
x = Math.pow(2, -3);
x = async () => Math.pow(await a, b);
x = async () => Math.pow(a, await b);
