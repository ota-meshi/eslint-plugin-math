/* {} */
/* ✓ GOOD */
x = Number.isInteger(n);

/* ✗ BAD */
x = Math.floor(n) === n;
x = Math.ceil(n) === n;
x = Math.trunc(n) === n;
