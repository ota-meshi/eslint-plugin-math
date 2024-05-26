/* {} */
/* ✓ GOOD */
x = Math.trunc(n);

/* ✗ BAD */
x = n >= 0 ? Math.floor(n) : Math.ceil(n);
// Not strictly equivalent to Math.trunc(n).
x = ~~n;
x = n & -1;
x = n | 0;
x = n ^ 0;
x = n >> 0;
