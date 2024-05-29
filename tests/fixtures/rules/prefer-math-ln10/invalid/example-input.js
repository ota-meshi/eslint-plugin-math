/* {} */
/* ✓ GOOD */
x = Math.LN10;

/* ✗ BAD */
x = Math.log(10);
x = 1 / Math.LOG10E;

/* ✓ GOOD */
x = y * Math.LN10;

/* ✗ BAD */
x = y / Math.LOG10E;
