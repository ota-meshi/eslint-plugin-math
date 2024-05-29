/* {} */

/* ✓ GOOD */
x = Math.log10(n);

/* ✗ BAD */
x = Math.log(n) * Math.LOG10E;
x = Math.log(n) / Math.LN10;
