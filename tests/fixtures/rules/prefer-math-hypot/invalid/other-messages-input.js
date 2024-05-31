/* {} */

/* ✓ GOOD */
x = Math.hypot(a, b);

/* ✗ BAD */
x = (a * a + b * b) ** 0.5;
x = (a ** 2 + b ** 2) ** 0.5;
x = (Math.pow(a, 2) + b ** 2 + Math.pow(c, 2) + d * d) ** 0.5;
x = Math.pow(a ** 2 + b ** 2, 0.5);
