const n = -5;
/* ✓ GOOD */
x = Math.abs(n);

/* ✗ BAD */
x = n < 0 ? -n : n;
x = n < 0 ? n * -1 : n;

/* ✗ BAD */
x = unknown < 0 ? -unknown : unknown;
/* ✗ BAD */
x = unknown < 0 ? unknown * -1 : unknown;

const b = -5n;

/* Ignore */
x = b < 0 ? -b : b;
/* ✗ BAD */
x = b < 0 ? b * -1 : b; // TypeError
