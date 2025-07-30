/* {} */
let text = "";
for (const value of [1, 2, 3]) {
  text += value;
}
x = text;

let text2 = "";
[4, 5, 6].forEach((value) => {
  text2 += value;
});
x = text2;

let text3 = "";
for (const value of [1, 2, 3]) {
  text3 = text3 + value;
}
x = text3;

let text4 = "";
for (const value of [1, 2, 3]) {
  text4 = value + text4;
}
x = text4;
