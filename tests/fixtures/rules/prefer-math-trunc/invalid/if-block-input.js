/* {} */
let x, y;
if (n >= 0) {
  console.log("foo");
  x = Math.floor(n);
} else {
  x = Math.ceil(n);
}
if (n >= 0) {
  {
    console.log("foo");
    x = Math.floor(n);
  }
} else {
  // prettier-ignore
  { 
    console.log("foo"); x = Math.ceil(n);
  }
}
if (n >= 0) {
  const foo = 42;
  x = Math.floor(n);
  console.log(x, foo);
} else {
  const foo = 42;
  x = Math.ceil(n);
  console.log(x, foo);
}
if (n >= 0) {
  let y = 42;
  x = Math.floor(n);
  console.log(x, y);
} else {
  let y = 42;
  x = Math.ceil(n);
  console.log(x, y);
}
