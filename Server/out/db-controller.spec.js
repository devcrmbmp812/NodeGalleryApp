"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_controller_1 = require("./db-controller");
const chai_1 = require("chai");
describe('A Database Controller ', () => {
    it('should exist after creation ', () => {
        let dbC = new db_controller_1.DbController(1);
        chai_1.expect(dbC).to.exist;
    });
    it('should be created with an ID', done => {
        let expectedId = 42;
        let dbC = new db_controller_1.DbController(expectedId);
        chai_1.expect(dbC.getId()).to.equal(expectedId);
        done();
    });
    it('should have a name', () => {
        let expectedString = "Something";
        let dbC = new db_controller_1.DbController(0);
        chai_1.expect(dbC.getSomething()).to.equal(expectedString);
    });
    it('should throw an Error upon asking for it', () => {
        let dbC = new db_controller_1.DbController(0);
        chai_1.expect(dbC.giveMeError).to.throw(Error);
    });
});
//# sourceMappingURL=db-controller.spec.js.map