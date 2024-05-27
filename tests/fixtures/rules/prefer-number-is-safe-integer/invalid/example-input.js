/* {} */
/* ✓ GOOD */
x = Number.isSafeInteger(n);

/* ✗ BAD */
x =
  Number.isInteger(n) &&
  Number.MIN_SAFE_INTEGER <= n &&
  n <= Number.MAX_SAFE_INTEGER;
x = Number.isInteger(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER;
x = Number.isInteger(n) && Math.abs(n) <= 0x1fffffffffffff;
