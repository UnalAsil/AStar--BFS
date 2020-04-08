"use strict";
class queue {
    constructor() {
        this.queue = [];
    }

    pop_min() {
        let min = this.queue[0].f;
        let idx = 0;
        let i = this.queue.length;
        while (--i) {
            if (this.queue[i].f < min) {
                min = this.queue[i].f;
                idx = i;
            }
        }
        let val = this.queue[idx];
        this.queue.splice(idx, 1);
        return val;
    }

    insert(item) {
        this.queue.push(item);
    }

    clear() {
        this.queue = [];
    }

}