type Tester = (number | string)[];
const test1: Tester = ["hello"];
const test2: Tester = [123, 234];
const some_obj = {
  name: "mary",
  age: 5,
  origin: "magrathea",
};
const no_obj = {};

console.log(test1.length);
console.log(Object.keys(some_obj).length);
console.log(Object.keys(no_obj).length);
