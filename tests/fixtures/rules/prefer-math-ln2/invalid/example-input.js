/* {} */
/* ✓ GOOD */
x = Math.LN2;

/* ✗ BAD */
x = Math.log(2);
x = 1 / Math.LOG2E;

/* ✓ GOOD */
x = y * Math.LN2;

/* ✗ BAD */
x = y / Math.LOG2E;
