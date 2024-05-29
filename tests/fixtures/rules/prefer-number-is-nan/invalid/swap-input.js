/* {} */
x = typeof n === "number" && isNaN(n);
x = isNaN(n) && typeof n === "number";
x = typeof n !== "number" || !isNaN(n);
x = !isNaN(n) || typeof n !== "number";
x = Object.is(n, NaN);
x = Object.is(NaN, n);

// OK
x = typeof n === "number" || isNaN(n);
x = isNaN(n) || typeof n === "number";
x = typeof n !== "number" && !isNaN(n);
x = !isNaN(n) && typeof n !== "number";
