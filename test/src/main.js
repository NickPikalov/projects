export let one = 1; // экспорт при объявлении

let two = 2;
export {
    two
}; // экспорт существующей переменной

export function sayHi() { // так же функция
    console.log('HELLO!');
}