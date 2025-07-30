/* {} */
const value = 42;

// Manual infinity and NaN checking
if (
  typeof value === "number" &&
  value !== Infinity &&
  value !== -Infinity &&
  !isNaN(value)
) {
  console.log("Value is a finite number");
}

// Using global isFinite directly (type coercion issues)
if (isFinite(value)) {
  console.log("Value might not actually be a number");
}
