/* {} */

/* ✓ GOOD */
x = Number.isNaN(n);

/* ✗ BAD */
x = typeof n === "number" && isNaN(n);
x = n !== n;
x = Object.is(n, NaN);
