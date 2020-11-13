console.log(1);

setTimeout(() => {
  console.log(2);
});

console.log(3);

const q = new Promise((resolve) => {
  const a = 4;
  //   setTimeout(() => {
  //     a = 4;
  //     resolve(a);
  //   }, 4000);
  resolve(a);
});

q.then((data) => {
  console.log(data);
});
