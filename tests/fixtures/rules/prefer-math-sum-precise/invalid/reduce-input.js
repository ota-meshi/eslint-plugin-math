/* {} */
x = [1, 2, 3].reduce((a, b) => a + b, 0);
x = [1, 2, 3].reduce((a, b) => b + a, 0);
x = [1, 2, 3].reduce((a, b) => {
  // This is a comment
  return a + b;
}, 0);
