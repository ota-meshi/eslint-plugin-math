/* {} */
/**
 * These test cases were heavily inspired by ESLint test cases.
 * https://github.com/eslint/eslint/blob/main/tests/lib/rules/prefer-exponentiation-operator.js
 */

// already parenthesised, shouldn't insert extra parens
x = +(Math.pow(a, b))
x = (Math.pow(a, b)).toString()
x = (class extends (Math.pow(a, b)) {})
x = class C extends (Math.pow(a, b)) {}

// doesn't remove already existing unnecessary parens around the whole expression
x = (Math.pow(a, b))
x = foo + (Math.pow(a, b))
x = (Math.pow(a, b)) + foo
x = `${(Math.pow(a, b))}`

// base and exponent with a lower precedence
x = Math.pow(a = b, c = d);
x = Math.pow(a += b, c -= d);

// doesn't put extra parens
x = Math.pow((a + b), (c + d));

// tokens that cannot be adjacent
x = (a)+(Math).pow((++b), c)
x = Math.pow(a, (b))in (c)

// tokens that cannot be adjacent, but there is already space or something else between
x = a+(Math.pow(++b, c))in d
