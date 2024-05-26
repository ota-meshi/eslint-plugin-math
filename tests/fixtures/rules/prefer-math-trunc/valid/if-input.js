/* {} */
if (n >= 1) {
  x = Math.floor(n);
} else {
  x = Math.ceil(n);
}
if (n > -1) {
  x = Math.floor(n);
} else {
  x = Math.ceil(n);
}
if (n <= 0.1) {
  x = Math.ceil(n);
} else {
  x = Math.floor(n);
}
if (n < -0.01) {
  x = Math.ceil(n);
} else {
  x = Math.floor(n);
}
if (0.2 <= n) {
  x = Math.floor(n);
} else {
  x = Math.ceil(n);
}
if (0.2 < n) {
  x = Math.floor(n);
} else {
  x = Math.ceil(n);
}
if (0.001 >= n) {
  x = Math.ceil(n);
} else {
  x = Math.floor(n);
}
if (0.001 > n) {
  x = Math.ceil(n);
} else {
  x = Math.floor(n);
}
if (foo(n >= 0)) {
  x = Math.floor(n);
} else {
  x = Math.ceil(n);
}
if (foo(n < 0)) {
  x = Math.ceil(n);
} else {
  x = Math.floor(n);
}
if (n === 0) {
  x = Math.floor(n);
} else {
  x = Math.ceil(n);
}
if (n == null) {
  x = Math.ceil(n);
} else {
  x = Math.floor(n);
}
