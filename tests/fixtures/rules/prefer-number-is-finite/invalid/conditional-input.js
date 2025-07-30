/* {} */
const n = 42;
x = typeof n !== "number" || n === Infinity || n === -Infinity || isNaN(n);
x = typeof n === "number" && n !== Infinity && n !== -Infinity && !isNaN(n);
x = typeof n === "number" && n !== Infinity && n === -Infinity && !isNaN(n); // -Infinity
