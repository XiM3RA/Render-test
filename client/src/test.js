/* const squareList = arr => {
    return arr.filter((x) => x >= 0 && x == parseInt(x)).map((i) => i * i | 0); }

const squaredIntegers = squareList([4, 5.6, -9.8, 3.14, 42, 6, 8.34, -2])

function alphabeticalOrder(arr) {
    arr.sort((a,b) => a === b ? 0 : a < b ? -1 : 1);
    return arr;
}


const globalArray = [5,6,3,2,9];

function nonMutatingSort(arr) {
    const newArr = [...arr]
    return newArr.sort((a,b) => a === b ? 0 : a < b ? -1 : 1);
}

function splitify(str) {
    return str.split(/[" ",-]/)
}

function sentensify(str) {
    return str.trim().split(/\s+/).join("-").toLowerCase();
}
*/


console.log(sentensify(" Winter Is  Coming"));
