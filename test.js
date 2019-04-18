var elements = [1, 5, 5, 3, 5, 2, 4];
var remove = 5;
var index = elements.indexOf(remove);

while (index !== -1) {
  elements.splice(index, 1);
  index = elements.indexOf(remove);
}

console.log('asda');
console.log(elements);
