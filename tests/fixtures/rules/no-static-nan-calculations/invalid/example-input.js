/* {} */

/* ✓ GOOD */
x = NaN;
x = Number.NaN;
x = Number("42");
x = parseInt("a", 16);
x = Number.parseInt("a", 16);
x = Infinity + Infinity;

/* ✗ BAD */
x = Infinity - Infinity;
x = Number.POSITIVE_INFINITY - Number.POSITIVE_INFINITY;
x = Number("a");
x = parseFloat("a");
x = parseInt("a");
x = Number.parseFloat("a");
x = Number.parseInt("a");
x = Math.pow();
x = Math.pow(-4, 0.5);
x = Math.sqrt(-4);
x = (-4) ** 0.5;
x = NaN + 1;
