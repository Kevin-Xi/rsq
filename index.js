'use strict';

let queues = {};
exports.getQueue = function (name) {
    if (queues[name]) {
        return queues[name];
    }
    let queue = new RSQueue(name);
    queues[name] = queue;
    return queue;
}

class RSQueue {
    constructor(name) {
        this.name = name;

        this._tasks = [];
        this._busy = false;
    }

    _run() {
        this._busy = true;

        if (this._tasks.length === 0) {
            this._busy = false;
            return;
        }

        let task = this._tasks.shift();
        task[0](...task.slice(1, -1), (err, result) => {
            task.slice(-1)[0](err, result);

            setImmediate(this._run.bind(this));
        });
    }

    push(func, ...args) {
        if (typeof func !== 'function' ||
            typeof args.slice(-1)[0] !== 'function') {
            return false;
        }

        this._tasks.push([func, ...args]);
        if (!this._busy) this._run();
        return true;
    }
}
