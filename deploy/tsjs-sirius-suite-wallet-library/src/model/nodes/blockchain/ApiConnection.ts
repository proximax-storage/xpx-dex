import { Observable } from "rxjs/internal/Observable";
import { BlockInfo } from "tsjs-xpx-chain-sdk/dist/src/model/blockchain/BlockInfo";
import { AccountHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/AccountHttp';
import { BlockHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/BlockHttp';
// import { MosaicHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/MosaicHttp';
// import { NamespaceHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/NamespaceHttp';
import { TransactionHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/TransactionHttp';
import { Connection } from "./Connection";


export class ApiConnection extends Connection {
    accountHttp: AccountHttp;
    blockHttp: BlockHttp;
    // mosaicHttp: MosaicHttp;
    // namespaceHttp: NamespaceHttp;
    transactionHttp: TransactionHttp;

    /**
     *
     *
     * @memberof ApiConnection
     */
    apiInstances() {
        if (!this.currentNode || this.currentNode === "") throw(`The url cannot be empty when instantiating api nodes`);
        this.accountHttp = new AccountHttp(this.currentNode);
        this.blockHttp = new BlockHttp(this.currentNode);
        // this.mosaicHttp = new MosaicHttp(this.currentNode);
        // this.namespaceHttp = new NamespaceHttp(this.currentNode);
        this.transactionHttp = new TransactionHttp(this.currentNode);
    }

    /**
     *
     *
     * @param {number} [height=1]
     * @param {string} [url='']
     * @returns
     * @memberof ApiConnection
     */
    getBlockInfo(height: number = 1, url: string = ''): Observable<BlockInfo> {
        if (this.blockHttp) return this.blockHttp.getBlockByHeight(height);
        if (!url) throw new Error(`You must add a node`);
        const blockHttp = new BlockHttp(url);
        return blockHttp.getBlockByHeight(height);
    }
}