/* {} */
/* ✓ GOOD */
x = Number.isInteger(n);

/* ✗ BAD */
x = Math.floor(n) === n;
x = Math.ceil(n) === n;
x = Math.trunc(n) === n;
x = Math.round(n) === n;

x = parseInt(n, 10) === n;
x = Number.parseInt(n, 10) === n;
