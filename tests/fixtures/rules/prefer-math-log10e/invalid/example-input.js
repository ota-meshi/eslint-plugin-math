/* {} */
/* ✓ GOOD */
x = Math.LOG10E;

/* ✗ BAD */
x = Math.log10(Math.E);
x = 1 / Math.LN10;

/* ✓ GOOD */
x = y * Math.LOG10E;

/* ✗ BAD */
x = y / Math.LN10;
