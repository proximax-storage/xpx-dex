import { Observable } from "rxjs/internal/Observable";
import { BlockInfo } from "tsjs-xpx-chain-sdk/dist/src/model/blockchain/BlockInfo";
import { AccountHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/AccountHttp';
import { BlockHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/BlockHttp';
import { TransactionHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/TransactionHttp';
import { Connection } from "./Connection";
export declare class ApiConnection extends Connection {
    accountHttp: AccountHttp;
    blockHttp: BlockHttp;
    transactionHttp: TransactionHttp;
    apiInstances(): void;
    getBlockInfo(height?: number, url?: string): Observable<BlockInfo>;
}
