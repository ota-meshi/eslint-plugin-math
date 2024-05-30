/* {} */

/* ✓ GOOD */
x = Number.EPSILON;

/* ✗ BAD */
x = 2 ** -52;
x = Math.pow(2, -52);
x = 2.220446049250313e-16;
