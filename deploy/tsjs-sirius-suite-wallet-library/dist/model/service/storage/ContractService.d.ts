import { Contract } from 'tsjs-xpx-dfms-api-http/dist/src/model/Contract';
import { Subject } from 'rxjs';
export declare class ContractService {
    private _contracts;
    private static _selectedContract;
    private static _selectedContractSubj;
    set contracts(contracts: Contract[]);
    static set contract(contract: Contract);
    get contractsList(): Contract[];
    static get selectedContract(): Subject<Contract>;
}
