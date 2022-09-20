// function a() {
//     console.log('A');
// }
var a = function () {
    console.log('A');
}

function b() {
    console.log('B');
}


function slowfunc(callback) {
    callback();
}


slowfunc(a);