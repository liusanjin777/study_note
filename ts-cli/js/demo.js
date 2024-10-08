"use strict";
function totalFruit(fruits) {
    let res = 0;
    let flag1 = 0;
    let flag2 = 0;
    fruits.forEach((v, i) => {
        if (v === fruits[flag1] || v === fruits[flag2]) {
            // flag1 = flag2
            flag2 = i;
            res = Math.max(res, flag2 - flag1);
        }
    });
    return res;
}
;
const res = totalFruit([1, 2, 2, 3]);
console.log(res);
