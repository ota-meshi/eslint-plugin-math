/* {} */

/* ✓ GOOD */
x = Number.isFinite(n);

/* ✗ BAD */
x = typeof n === "number" && isFinite(n);
