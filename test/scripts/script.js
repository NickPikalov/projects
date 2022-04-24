'use strict';

function deepCount(arr) {
    let counter = 0;

    return counter;
}

console.log(deepCount([1, [2, []], 3]));


function sayName() {
    console.log(this); // да, здесь по идее должен быть undefined
    console.log(this.name);
}
const user = {
    name: 'john'
};
//но можно этой функции предать контекст с помощью call() или apply()
sayName.call(user);