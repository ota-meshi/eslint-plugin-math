/* {} */
/* ✓ GOOD */
x = Math.LOG2E;

/* ✗ BAD */
x = Math.log2(Math.E);
x = 1 / Math.LN2;

/* ✓ GOOD */
x = y * Math.LOG2E;

/* ✗ BAD */
x = y / Math.LN2;
