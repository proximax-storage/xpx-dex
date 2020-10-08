"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketConnection = exports.TypeStatusNode = void 0;
const BehaviorSubject_1 = require("rxjs/internal/BehaviorSubject");
const Listener_1 = require("tsjs-xpx-chain-sdk/dist/src/infrastructure/Listener");
const Utilities_1 = require("../../../utils/Utilities");
const Connection_1 = require("./Connection");
var TypeStatusNode;
(function (TypeStatusNode) {
    TypeStatusNode[TypeStatusNode["NODE_OFF"] = 0] = "NODE_OFF";
    TypeStatusNode[TypeStatusNode["NODE_CONNECTING"] = 1] = "NODE_CONNECTING";
    TypeStatusNode[TypeStatusNode["NODE_ACTIVE"] = 2] = "NODE_ACTIVE";
    TypeStatusNode[TypeStatusNode["NODE_STUCK"] = 3] = "NODE_STUCK";
    TypeStatusNode[TypeStatusNode["NODE_SYNCHRONIZING"] = 4] = "NODE_SYNCHRONIZING";
})(TypeStatusNode = exports.TypeStatusNode || (exports.TypeStatusNode = {}));
class WebsocketConnection extends Connection_1.Connection {
    constructor() {
        super(...arguments);
        this._statusNode = new BehaviorSubject_1.BehaviorSubject(TypeStatusNode.NODE_OFF);
        this._statusNode$ = this._statusNode.asObservable();
        this._newBlock = new BehaviorSubject_1.BehaviorSubject(null);
        this._newBlock$ = this._newBlock.asObservable();
        this._confirmed = new BehaviorSubject_1.BehaviorSubject(null);
        this._confirmed$ = this._confirmed.asObservable();
        this._unconfirmedAdded = new BehaviorSubject_1.BehaviorSubject(null);
        this._unconfirmedAdded$ = this._unconfirmedAdded.asObservable();
        this._unconfirmedRemoved = new BehaviorSubject_1.BehaviorSubject(null);
        this._unconfirmedRemoved$ = this._unconfirmedRemoved.asObservable();
        this._aggregateBondedAdded = new BehaviorSubject_1.BehaviorSubject(null);
        this._aggregateBondedAdded$ = this._aggregateBondedAdded.asObservable();
        this._aggregateBondedRemoved = new BehaviorSubject_1.BehaviorSubject(null);
        this._aggregateBondedRemoved$ = this._aggregateBondedRemoved.asObservable();
        this._status = new BehaviorSubject_1.BehaviorSubject(null);
        this._status$ = this._status.asObservable();
        this._cosignatureAdded = new BehaviorSubject_1.BehaviorSubject(null);
        this._cosignatureAdded$ = this._cosignatureAdded.asObservable();
        this.cacheBlock = 1;
        this.checking = false;
        this.connector = null;
    }
    checkActiveConnector(height) {
        const _this = this;
        this.clearTimeOutTime();
        this.timeOut = setTimeout(function () {
            Utilities_1.Utilities.logs(`The connection node is stuck..`);
            _this._statusNode.next(TypeStatusNode.NODE_STUCK);
            _this.clearTimeOutTime();
            _this.closeConnectionWs();
        }, Number(WebsocketConnection.nodesConfig.timeOutNewBlocks) * 1000);
        if (this.connector && !this.checking) {
            this.checking = true;
            setTimeout(() => {
                _this.checking = false;
                if (_this.cacheBlock > 1 && height > _this.cacheBlock + 4) {
                    Utilities_1.Utilities.logs(`The node is synchronizing`);
                    _this._statusNode.next(TypeStatusNode.NODE_SYNCHRONIZING);
                    _this.clearTimeOutTime();
                    _this.closeConnectionWs();
                }
                else {
                    _this.cacheBlock = height;
                }
            }, Number(WebsocketConnection.nodesConfig.timeValidateSynchronization) * 1000);
        }
    }
    clearTimeOutTime() {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
            this.timeOut = null;
        }
    }
    openConnection() {
        return new Promise((resolve, reject) => {
            this.cacheBlock = 1;
            this.checking = false;
            if (this.connector !== null && this.connector !== undefined) {
                this.connector.open().then(() => {
                    this._statusNode.next(TypeStatusNode.NODE_ACTIVE);
                    try {
                        this.checkActiveConnector(1);
                    }
                    catch (e) {
                        Utilities_1.Utilities.logs('newwww error', e);
                    }
                    this.monitorBlocks();
                    resolve(true);
                }).catch(e => {
                    Utilities_1.Utilities.logs('catch newwww error', e);
                    reject(`Error connecting to the node`);
                });
            }
            else {
                resolve(true);
            }
        });
    }
    monitorBlocks() {
        this.connector.newBlock().subscribe((block) => {
            this.height = block.height;
            this._newBlock.next(block);
            try {
                this.checkActiveConnector(block.height.compact());
            }
            catch (e) {
                Utilities_1.Utilities.logs('newwww error', e);
            }
            Utilities_1.Utilities.logs("-----------------------BLOCKS--------------------------");
            Utilities_1.Utilities.logs(block.height.compact());
            Utilities_1.Utilities.logs("-------------------------------------------------------\n\n");
        });
    }
    buildURL(url) {
        const split = Utilities_1.Utilities.splitURL(url);
        switch (split.protocol) {
            case 'http':
                return `ws://${split.domainIp}:${split.port}`;
            default:
                return `wss://${split.domainIp}:${split.port}`;
        }
    }
    connect(websocketInjected = false) {
        return new Promise((resolve, reject) => {
            if (!this.currentNode || this.currentNode === "")
                reject('Invalid node');
            this.closeConnectionWs();
            const url = this.buildURL(this.currentNode);
            Utilities_1.Utilities.logs('Connecting websocket...', url);
            this._statusNode.next(TypeStatusNode.NODE_CONNECTING);
            if (websocketInjected)
                this.connector = new Listener_1.Listener(url, WebSocket);
            else
                this.connector = new Listener_1.Listener(url);
            this.openConnection().then(r => resolve(r)).catch(e => reject(e));
        });
    }
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
            if (this._statusNode.getValue() !== TypeStatusNode.NODE_OFF)
                this._statusNode.next(TypeStatusNode.NODE_OFF);
            Utilities_1.Utilities.logs("connection closed!");
        }
    }
    checkIsOpenConnection() {
        return (this.connector !== null && this.connector !== undefined && this.connector.isOpen) ? true : false;
    }
    monitorAllChannels(addressArray) {
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
    monitorAggregateBondedAdded(arrayAddress) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.aggregateBondedAdded(address).subscribe((transaction) => {
                    this._aggregateBondedAdded.next(transaction);
                    Utilities_1.Utilities.logs("-----------------------AGGREGATE_BONDED_ADDED--------------------------");
                    Utilities_1.Utilities.logs(transaction.transactionInfo.hash);
                    Utilities_1.Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }
    monitorAggregateBondedRemoved(arrayAddress) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.aggregateBondedRemoved(address).subscribe((hash) => {
                    this._aggregateBondedRemoved.next(hash);
                    Utilities_1.Utilities.logs("-----------------------AGGREGATE_BONDED_REMOVED--------------------------");
                    Utilities_1.Utilities.logs(hash);
                    Utilities_1.Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }
    monitorCosignatureAdded(arrayAddress) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.cosignatureAdded(address).subscribe((transaction) => {
                    this._cosignatureAdded.next(transaction);
                    Utilities_1.Utilities.logs("-----------------------COSIGNATURE_ADDED--------------------------");
                    Utilities_1.Utilities.logs(transaction.parentHash);
                    Utilities_1.Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }
    monitorConfirmed(arrayAddress) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.confirmed(address).subscribe((transaction) => {
                    Utilities_1.Utilities.logs("-----------------------CONFIRMED--------------------------");
                    Utilities_1.Utilities.logs(transaction.transactionInfo.hash);
                    Utilities_1.Utilities.logs("------------------------------------------------------------------\n\n");
                    this._confirmed.next(transaction);
                });
            });
        }
    }
    monitorUnconfirmedAdded(arrayAddress) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.unconfirmedAdded(address).subscribe((transaction) => {
                    this._unconfirmedAdded.next(transaction);
                    Utilities_1.Utilities.logs("-----------------------UNCONFIRMED_ADDED--------------------------");
                    Utilities_1.Utilities.logs(transaction.transactionInfo.hash);
                    Utilities_1.Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }
    monitorUnconfirmedRemoved(arrayAddress) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.unconfirmedRemoved(address).subscribe((hash) => {
                    this._unconfirmedRemoved.next(hash);
                    Utilities_1.Utilities.logs("-----------------------UNCONFIRMED_REMOVED--------------------------");
                    Utilities_1.Utilities.logs(hash);
                    Utilities_1.Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }
    monitorStatus(arrayAddress) {
        if (this.checkIsOpenConnection()) {
            arrayAddress.forEach((address) => {
                this.connector.status(address).subscribe((transaction) => {
                    this._status.next(transaction);
                    Utilities_1.Utilities.logs("-----------------------STATUS--------------------------");
                    Utilities_1.Utilities.logs(transaction.hash);
                    Utilities_1.Utilities.logs("------------------------------------------------------------------\n\n");
                });
            });
        }
    }
    get aggregateBondedAdded() {
        return this._aggregateBondedAdded$;
    }
    get aggregateBondedRemoved() {
        return this._aggregateBondedRemoved$;
    }
    get cosignatureAdded() {
        return this._cosignatureAdded$;
    }
    get confirmed() {
        return this._confirmed$;
    }
    get newBlock() {
        return this._newBlock$;
    }
    get status() {
        return this._status$;
    }
    get statusNode() {
        return this._statusNode$;
    }
    get unconfirmedAdded() {
        return this._unconfirmedAdded$;
    }
    get unconfirmedRemoved() {
        return this._unconfirmedRemoved$;
    }
}
exports.WebsocketConnection = WebsocketConnection;
WebsocketConnection.nodesConfig = {
    timeOutConnection: "",
    connectToWebsocket: true,
    timeOutNewBlocks: 170,
    timeValidateSynchronization: 20
};
