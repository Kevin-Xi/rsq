'use strict';

const testRsq = require('.').getQueue('test');

function asyncTask (no, callback) {
    setTimeout(callback, Math.floor(Math.random() * 1e3), null, no);
}

function normalCallback (err, result) {
    console.info(`n-${result}`);
}

function queuedCallback (err, result) {
    console.info(`\tq-${result}`);
}


for (let i = 0; i < 10; i++) {
    asyncTask(i, normalCallback);
}

for (let j = 0; j < 10; j++) {
    testRsq.push(asyncTask, j, queuedCallback);
}
