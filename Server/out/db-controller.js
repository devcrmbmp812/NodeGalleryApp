"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbController {
    constructor(id) {
        this.id = id;
    }
    /**
     * name
     */
    getSomething() {
        return "Something";
    }
    getId() {
        return this.id;
    }
    giveMeError() {
        throw new Error('You asked for it');
    }
}
exports.DbController = DbController;
//# sourceMappingURL=db-controller.js.map