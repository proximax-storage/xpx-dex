"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConnection = void 0;
const AccountHttp_1 = require("tsjs-xpx-chain-sdk/dist/src/infrastructure/AccountHttp");
const BlockHttp_1 = require("tsjs-xpx-chain-sdk/dist/src/infrastructure/BlockHttp");
const TransactionHttp_1 = require("tsjs-xpx-chain-sdk/dist/src/infrastructure/TransactionHttp");
const Connection_1 = require("./Connection");
class ApiConnection extends Connection_1.Connection {
    apiInstances() {
        if (!this.currentNode || this.currentNode === "")
            throw (`The url cannot be empty when instantiating api nodes`);
        this.accountHttp = new AccountHttp_1.AccountHttp(this.currentNode);
        this.blockHttp = new BlockHttp_1.BlockHttp(this.currentNode);
        this.transactionHttp = new TransactionHttp_1.TransactionHttp(this.currentNode);
    }
    getBlockInfo(height = 1, url = '') {
        if (this.blockHttp)
            return this.blockHttp.getBlockByHeight(height);
        if (!url)
            throw new Error(`You must add a node`);
        const blockHttp = new BlockHttp_1.BlockHttp(url);
        return blockHttp.getBlockByHeight(height);
    }
}
exports.ApiConnection = ApiConnection;
