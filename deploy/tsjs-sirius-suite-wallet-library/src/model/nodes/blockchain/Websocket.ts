import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { Listener } from "tsjs-xpx-chain-sdk/dist/src/infrastructure/Listener";
import { Address } from "tsjs-xpx-chain-sdk/dist/src/model/account/Address";
import { Transaction } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/Transaction';
import { BlockInfo } from 'tsjs-xpx-chain-sdk/dist/src/model/blockchain/BlockInfo';
import { AggregateTransaction } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/AggregateTransaction';
import { TransactionStatusError } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/TransactionStatusError';
import { CosignatureSignedTransaction } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/CosignatureSignedTransaction';
import { Utilities } from "../../../utils/Utilities";
import { Connection } from "./Connection";


export enum TypeStatusNode  {
    NODE_OFF = 0,
    NODE_CONNECTING = 1,
    NODE_ACTIVE = 2,
    NODE_STUCK = 3,
    NODE_SYNCHRONIZING = 4
}

export class WebsocketConnection extends Connection {
    // Status Node
    private _statusNode: BehaviorSubject<number> = new BehaviorSubject<number>(TypeStatusNode.NODE_OFF);
    private _statusNode$: Observable<number> = this._statusNode.asObservable();
    // Status NewBlock
    private _newBlock: BehaviorSubject<BlockInfo> = new BehaviorSubject<BlockInfo>(null);
    private _newBlock$: Observable<BlockInfo> = this._newBlock.asObservable();
    // Status confirmed
    private _confirmed: BehaviorSubject<Transaction> = new BehaviorSubject<Transaction>(null);
    private _confirmed$: Observable<Transaction> = this._confirmed.asObservable();
    // Status unconfirmedAdded
    private _unconfirmedAdded: BehaviorSubject<Transaction> = new BehaviorSubject<Transaction>(null);
    private _unconfirmedAdded$: Observable<Transaction> = this._unconfirmedAdded.asObservable();
    // Status unconfirmedRemoved
    private _unconfirmedRemoved: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private _unconfirmedRemoved$: Observable<string> = this._unconfirmedRemoved.asObservable();
    // Status AggregateBondedAdded
    private _aggregateBondedAdded: BehaviorSubject<AggregateTransaction> = new BehaviorSubject<AggregateTransaction>(null);
    private _aggregateBondedAdded$: Observable<AggregateTransaction> = this._aggregateBondedAdded.asObservable();
    // Status AggregateBondedRemoved
    private _aggregateBondedRemoved: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private _aggregateBondedRemoved$: Observable<string> = this._aggregateBondedRemoved.asObservable();
    // Status Status
    private _status: BehaviorSubject<TransactionStatusError> = new BehaviorSubject<TransactionStatusError>(null);
    private _status$: Observable<TransactionStatusError> = this._status.asObservable();
    // Status CosignatureAdded
    private _cosignatureAdded: BehaviorSubject<CosignatureSignedTransaction> = new BehaviorSubject<CosignatureSignedTransaction>(null);
    private _cosignatureAdded$: Observable<CosignatureSignedTransaction> = this._cosignatureAdded.asObservable();

    private cacheBlock: number = 1;
    private checking: boolean = false;
    private connector: Listener = null;
    private timeOut: NodeJS.Timeout;
    static nodesConfig = {
        timeOutConnection: "",
        connectToWebsocket: true,
        timeOutNewBlocks: 170, // 130
        timeValidateSynchronization: 20 // 10000
    };

    /**
     *
     *
     * @private
     * @param {number} height
     * @memberof Websocket
     */
    private checkActiveConnector(height: number) {
        // Init timeOut
        const _this = this;
        this.clearTimeOutTime();
        this.timeOut = setTimeout(function () {
            Utilities.logs(`The connection node is stuck..`);
            _this._statusNode.next(TypeStatusNode.NODE_STUCK)
            _this.clearTimeOutTime();
            _this.closeConnectionWs();
            // throw (`The connection node is stuck..`);
        }, Number(WebsocketConnection.nodesConfig.timeOutNewBlocks) * 1000);


        // Check connector
        if (this.connector && !this.checking) {
            this.checking = true;
            setTimeout(() => {
                _this.checking = false;
                if (_this.cacheBlock > 1 && height > _this.cacheBlock + 4) {
                    Utilities.logs(`The node is synchronizing`)
                    _this._statusNode.next(TypeStatusNode.NODE_SYNCHRONIZING)
                    _this.clearTimeOutTime();
                    _this.closeConnectionWs();
                    // throw (`The node is synchronizing`);
                } else {
                    _this.cacheBlock = height;
                }
            }, Number(WebsocketConnection.nodesConfig.timeValidateSynchronization) * 1000);
        }
    }

    /**
     *
     *
     * @private
     * @memberof Websocket
     */
    private clearTimeOutTime() {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
            this.timeOut = null;
        }
    }
    
    /**
     *
     *
     * @memberof WebSocket
     */
    private openConnection() {
        return new Promise<boolean>((resolve, reject) => {
            this.cacheBlock = 1;
            this.checking = false;
            if (this.connector !== null && this.connector !== undefined) {
                this.connector.open().then(() => {
                    this._statusNode.next(TypeStatusNode.NODE_ACTIVE)
                    try { 
                        this.checkActiveConnector(1); 
                    } catch (e) { 
                        Utilities.logs('newwww error', e) 
                    }
                    this.monitorBlocks();
                    resolve(true);
                }).catch(e => {
                    Utilities.logs('catch newwww error', e)
                    reject(`Error connecting to the node`)
                });
            } else {
                resolve(true);
            }
        })
    }

    /**
     *
     * @memberof Websocket
     */
    private monitorBlocks() {
        this.connector.newBlock().subscribe((block) => {
            this.height = block.height;
            this._newBlock.next(block)
            try { 
                this.checkActiveConnector(block.height.compact()); 
            } catch (e) { 
                Utilities.logs('newwww error', e) 
            }
            Utilities.logs("-----------------------BLOCKS--------------------------");
            Utilities.logs(block.height.compact());
            Utilities.logs("-------------------------------------------------------\n\n");
        });
    }

    /**
     *
     *
     * @private
     * @param {string} url
     * @returns
     * @memberof WebsocketConnection
     */
    private buildURL (url: string) {
        const split = Utilities.splitURL(url)
        switch (split.protocol) {
            case 'http':
                return `ws://${split.domainIp}:${split.port}`
            default:
                return `wss://${split.domainIp}:${split.port}`;
        }
    }

    /**
     *
     *
     * @memberof Websocket
     */
    connect(websocketInjected: boolean = false) {
        return new Promise<boolean>((resolve, reject) => {
            if (!this.currentNode || this.currentNode === "") reject('Invalid node');
            this.closeConnectionWs();
            const url = this.buildURL(this.currentNode)
            Utilities.logs('Connecting websocket...', url)
            this._statusNode.next(TypeStatusNode.NODE_CONNECTING)
            if (websocketInjected) this.connector = new Listener(url, WebSocket)
            else this.connector = new Listener(url);
            this.openConnection().then(r => resolve(r)).catch(e => reject(e));
        });
    }

    /**
     *
     *
     * @memberof WebSocket
     */
    closeConnectionWs() {
        if (this.checkIsOpenConnection()) {
            this.connector.close();
            this.connector.terminate();
            this.connector = null;
            this._aggregateBondedAdded.next(null);
            this._aggregateBondedRemoved.next(null);
            this._cosignatureAdded.next(null);
            this._confirmed.next(null);
            this._unconfirmedAdded.next(null);
            this._unconfirmedRemoved.next(null);
            this._status.next(null);
            this.clearTimeOutTime();
            if (this._statusNode.getValue() !== TypeStatusNode.NODE_OFF) this._statusNode.next(TypeStatusNode.NODE_OFF);
            Utilities.logs("connection closed!");
        }
    }

    /**
     * 
     *
     * @returns
     * @memberof Websocket
     */
    checkIsOpenConnection() {
        return (this.connector !== null && this.connector !== undefined && this.connector.isOpen) ? true : false;
    }

    /**
     *
     *
     * @param {*} addressArray
     * @memberof WebSocket
     */
    monitorAllChannels(addressArray: Address[]) {
        if (this.checkIsOpenConnection()) {
            this.monitorAggregateBondedAdded(addressArray);
            this.monitorAggregateBondedRemoved(addressArray);
            this.monitorCosignatureAdded(addressArray);
            this.monitorConfirmed(addressArray);
            this.monitorUnconfirmedAdded(addressArray);
            this.monitorUnconfirmedRemoved(addressArray);
            this.monitorStatus(addressArray);
        }
    }

    /**
     *
     *
     * @param {Address[]} arrayAddress
     * @memberof Websocket
     */
    monitorAggregateBondedAdded(arrayAddress: Address[]) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.aggregateBondedAdded(address).subscribe((transaction) => {
                    this._aggregateBondedAdded.next(transaction)
                    Utilities.logs("-----------------------AGGREGATE_BONDED_ADDED--------------------------");
                    Utilities.logs(transaction.transactionInfo.hash);
                    Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }

    /**
     *
     *
     * @param {Address[]} arrayAddress
     * @memberof Websocket
     */
    monitorAggregateBondedRemoved(arrayAddress: Address[]) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.aggregateBondedRemoved(address).subscribe((hash) => {
                    this._aggregateBondedRemoved.next(hash)
                    Utilities.logs("-----------------------AGGREGATE_BONDED_REMOVED--------------------------");
                    Utilities.logs(hash);
                    Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }

    /**
     *
     *
     * @param {Address[]} arrayAddress
     * @memberof Websocket
     */
    monitorCosignatureAdded(arrayAddress: Address[]) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.cosignatureAdded(address).subscribe((transaction) => {
                    this._cosignatureAdded.next(transaction)
                    Utilities.logs("-----------------------COSIGNATURE_ADDED--------------------------");
                    Utilities.logs(transaction.parentHash);
                    Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }

    /**
     *
     *
     * @param {Address[]} arrayAddress
     * @memberof Websocket
     */
    monitorConfirmed(arrayAddress: Address[]) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.confirmed(address).subscribe((transaction) => {
                    Utilities.logs("-----------------------CONFIRMED--------------------------");
                    Utilities.logs(transaction.transactionInfo.hash);
                    Utilities.logs("------------------------------------------------------------------\n\n");
                    this._confirmed.next(transaction)
                });
            });
        }
    }

    /**
     *
     *
     * @param {Address[]} arrayAddress
     * @memberof Websocket
     */
    monitorUnconfirmedAdded(arrayAddress: Address[]) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.unconfirmedAdded(address).subscribe((transaction) => {
                    this._unconfirmedAdded.next(transaction)
                    Utilities.logs("-----------------------UNCONFIRMED_ADDED--------------------------");
                    Utilities.logs(transaction.transactionInfo.hash);
                    Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }

    /**
     *
     *
     * @param {Address[]} arrayAddress
     * @memberof Websocket
     */
    monitorUnconfirmedRemoved(arrayAddress: Address[]) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.unconfirmedRemoved(address).subscribe((hash) => {
                    this._unconfirmedRemoved.next(hash)
                    Utilities.logs("-----------------------UNCONFIRMED_REMOVED--------------------------");
                    Utilities.logs(hash);
                    Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }

    /**
     *
     *
     * @param {Address[]} arrayAddress
     * @memberof Websocket
     */
    monitorStatus(arrayAddress: Address[]) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.status(address).subscribe((transaction) => {
                    this._status.next(transaction)
                    Utilities.logs("-----------------------STATUS--------------------------");
                    Utilities.logs(transaction.hash);
                    Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }

    /**
     *
     *
     * @readonly
     * @type {Observable<AggregateTransaction>}
     * @memberof WebsocketConnection
     */
    get aggregateBondedAdded (): Observable<AggregateTransaction> {
        return this._aggregateBondedAdded$;
    }

    /**
     *
     *
     * @readonly
     * @type {Observable<string>}
     * @memberof WebsocketConnection
     */
    get aggregateBondedRemoved (): Observable<string> {
        return this._aggregateBondedRemoved$;
    }

    /**
     *
     *
     * @readonly
     * @type {Observable<CosignatureSignedTransaction>}
     * @memberof WebsocketConnection
     */
    get cosignatureAdded (): Observable<CosignatureSignedTransaction> {
        return this._cosignatureAdded$;
    }

    /**
     *
     *
     * @readonly
     * @type {Observable<Transaction>}
     * @memberof WebsocketConnection
     */
    get confirmed (): Observable<Transaction> {
        return this._confirmed$;
    }

    /**
     *
     *
     * @readonly
     * @type {Observable<BlockInfo>}
     * @memberof WebsocketConnection
     */
    get newBlock (): Observable<BlockInfo> {
        return this._newBlock$;
    }

    /**
     *
     *
     * @readonly
     * @type {Observable<TransactionStatusError>}
     * @memberof WebsocketConnection
     */
    get status (): Observable<TransactionStatusError> {
        return this._status$;
    }

    /**
     *
     *
     * @readonly
     * @type {Observable<number>}
     * @memberof WebsocketConnection
     */
    get statusNode (): Observable<number> {
        return this._statusNode$;
    }

    /**
     *
     *
     * @readonly
     * @type {Observable<Transaction>}
     * @memberof WebsocketConnection
     */
    get unconfirmedAdded (): Observable<Transaction> {
        return this._unconfirmedAdded$;
    }

    /**
     *
     *
     * @readonly
     * @type {Observable<string>}
     * @memberof WebsocketConnection
     */
    get unconfirmedRemoved (): Observable<string> {
        return this._unconfirmedRemoved$;
    }
}
