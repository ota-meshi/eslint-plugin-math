/* {} */
/* ✓ GOOD */
x = Math.sumPrecise([1, 2, 3]);

/* ✗ BAD */
x = [1, 2, 3].reduce((a, b) => a + b, 0);
let sum = 0;
for (const value of [1, 2, 3]) {
  sum += value;
}
x = sum;
