import { Contract } from 'tsjs-xpx-dfms-api-http/dist/src/model/Contract';
import { Subject } from 'rxjs';
export class ContractService {
    private _contracts: Contract[]
    private static _selectedContract: Contract;
    private static _selectedContractSubj = new Subject<Contract>();
    set contracts(contracts: Contract[]) {
        this._contracts = contracts
    }
    static set contract(contract: Contract) {
        this._selectedContractSubj.next(this._selectedContract);
    }
    get contractsList(): Contract[] {
        return this._contracts
    }
    static get selectedContract() {
        return this._selectedContractSubj;
    }

}