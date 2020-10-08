import { Observable } from "rxjs/internal/Observable";
import { Address } from "tsjs-xpx-chain-sdk/dist/src/model/account/Address";
import { Transaction } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/Transaction';
import { BlockInfo } from 'tsjs-xpx-chain-sdk/dist/src/model/blockchain/BlockInfo';
import { AggregateTransaction } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/AggregateTransaction';
import { TransactionStatusError } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/TransactionStatusError';
import { CosignatureSignedTransaction } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/CosignatureSignedTransaction';
import { Connection } from "./Connection";
export declare enum TypeStatusNode {
    NODE_OFF = 0,
    NODE_CONNECTING = 1,
    NODE_ACTIVE = 2,
    NODE_STUCK = 3,
    NODE_SYNCHRONIZING = 4
}
export declare class WebsocketConnection extends Connection {
    private _statusNode;
    private _statusNode$;
    private _newBlock;
    private _newBlock$;
    private _confirmed;
    private _confirmed$;
    private _unconfirmedAdded;
    private _unconfirmedAdded$;
    private _unconfirmedRemoved;
    private _unconfirmedRemoved$;
    private _aggregateBondedAdded;
    private _aggregateBondedAdded$;
    private _aggregateBondedRemoved;
    private _aggregateBondedRemoved$;
    private _status;
    private _status$;
    private _cosignatureAdded;
    private _cosignatureAdded$;
    private cacheBlock;
    private checking;
    private connector;
    private timeOut;
    static nodesConfig: {
        timeOutConnection: string;
        connectToWebsocket: boolean;
        timeOutNewBlocks: number;
        timeValidateSynchronization: number;
    };
    private checkActiveConnector;
    private clearTimeOutTime;
    private openConnection;
    private monitorBlocks;
    private buildURL;
    connect(websocketInjected?: boolean): Promise<boolean>;
    closeConnectionWs(): void;
    checkIsOpenConnection(): boolean;
    monitorAllChannels(addressArray: Address[]): void;
    monitorAggregateBondedAdded(arrayAddress: Address[]): void;
    monitorAggregateBondedRemoved(arrayAddress: Address[]): void;
    monitorCosignatureAdded(arrayAddress: Address[]): void;
    monitorConfirmed(arrayAddress: Address[]): void;
    monitorUnconfirmedAdded(arrayAddress: Address[]): void;
    monitorUnconfirmedRemoved(arrayAddress: Address[]): void;
    monitorStatus(arrayAddress: Address[]): void;
    get aggregateBondedAdded(): Observable<AggregateTransaction>;
    get aggregateBondedRemoved(): Observable<string>;
    get cosignatureAdded(): Observable<CosignatureSignedTransaction>;
    get confirmed(): Observable<Transaction>;
    get newBlock(): Observable<BlockInfo>;
    get status(): Observable<TransactionStatusError>;
    get statusNode(): Observable<number>;
    get unconfirmedAdded(): Observable<Transaction>;
    get unconfirmedRemoved(): Observable<string>;
}
