/* {} */
let sum = 0;
for (const value of [1, 2, 3]) {
  sum += value;
}
x = sum;

let sum2 = 0;
[4, 5, 6].forEach((value) => {
  sum2 += value;
});
x = sum2;

let sum3 = 0;
for (const value of [1, 2, 3]) {
  sum3 = sum3 + value;
}
x = sum3;

let sum4 = 0;
for (const value of [1, 2, 3]) {
  sum4 = value + sum4;
}
x = sum4;
