"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractService = void 0;
const rxjs_1 = require("rxjs");
class ContractService {
    set contracts(contracts) {
        this._contracts = contracts;
    }
    static set contract(contract) {
        this._selectedContractSubj.next(this._selectedContract);
    }
    get contractsList() {
        return this._contracts;
    }
    static get selectedContract() {
        return this._selectedContractSubj;
    }
}
exports.ContractService = ContractService;
ContractService._selectedContractSubj = new rxjs_1.Subject();
