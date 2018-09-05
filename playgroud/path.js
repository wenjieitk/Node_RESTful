const path =  require('path');

let pathObj = path.parse(__filename);
let pathObj2 = path.parse(__dirname);

console.log(pathObj);
console.log(pathObj2);


