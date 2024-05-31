/* {} */

/* ✓ GOOD */
x = Math.hypot(a, b);

/* ✗ BAD */
x = Math.sqrt(a * a + b * b);
x = (a * a + b * b) ** (1 / 2);
x = Math.sqrt(a ** 2 + b ** 2);
x = (a ** 2 + b ** 2) ** (1 / 2);
x = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
x = Math.pow(a ** 2 + b ** 2, 1 / 2);
