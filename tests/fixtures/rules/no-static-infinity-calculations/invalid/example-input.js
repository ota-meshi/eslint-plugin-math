/* {} */

/* ✓ GOOD */
x = Infinity;
x = -Infinity;
x = Number.POSITIVE_INFINITY;
x = Number.NEGATIVE_INFINITY;
x = 2 ** 1023 - 2 ** 971 + 2 ** 1023;

/* ✗ BAD */
x = 2 ** 1024;
x = 2 ** 1024 - 2 ** 971;
x = 2 ** 1023 + 2 ** 1023;
x = 2 ** 1023 - 2 ** 970 + 2 ** 1023;
