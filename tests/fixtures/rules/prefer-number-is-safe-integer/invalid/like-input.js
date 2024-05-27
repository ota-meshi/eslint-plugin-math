/* {} */
x =
  Math.floor(n) === n &&
  Number.MIN_SAFE_INTEGER <= n &&
  n <= Number.MAX_SAFE_INTEGER;
x = Math.floor(n) === n && Math.abs(n) <= Number.MAX_SAFE_INTEGER;
x = Math.floor(n) === n && Math.abs(n) <= 0x1fffffffffffff;
x =
  Math.floor(n) !== n ||
  Number.MIN_SAFE_INTEGER > n ||
  n > Number.MAX_SAFE_INTEGER;
x = Math.floor(n) !== n || Math.abs(n) > Number.MAX_SAFE_INTEGER;
x = Math.floor(n) !== n || Math.abs(n) > 0x1fffffffffffff;
