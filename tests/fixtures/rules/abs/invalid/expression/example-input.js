/* ✓ GOOD */
x = n < 0 ? -n : n;

/* ✗ BAD */
x = Math.abs(n);
x = n < 0 ? n * -1 : n;
