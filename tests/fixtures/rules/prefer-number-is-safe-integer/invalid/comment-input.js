/* {} */
x =
  Number.isInteger(foo) /* comment */ &&
  Number.MIN_SAFE_INTEGER <= foo &&
  foo <= Number.MAX_SAFE_INTEGER;
x = Number.isInteger(n) && /* comment */ Math.abs(n) <= Number.MAX_SAFE_INTEGER;
x = Number.isInteger(n) /* comment */ && Math.abs(n) <= 0x1fffffffffffff;
