"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriveService = void 0;
const rxjs_1 = require("rxjs");
const Node_1 = require("../../nodes/storage/Node");
class DriveService {
    constructor(connection) {
        this._statSubj = new rxjs_1.Subject();
        this._lsSubj = new rxjs_1.Subject();
        this._connection = connection;
    }
    doStat(cid, path, parent) {
        this._connection.stat(cid, path).subscribe(stat => {
            this._statSubj.next(new Node_1.Node(cid, stat, parent));
        });
    }
    doLs(cid, node) {
        this._connection.ls(cid, node.path).subscribe(stats => this._lsSubj.next(stats.map(stat => new Node_1.Node(cid, stat, node))));
    }
    doAdd(cid, parent, name, body, flush = true) {
        this._connection.add(cid, parent.path + "/" + name, body, flush).subscribe(() => {
            this.doLs(cid, parent);
        });
    }
    doDelete(cid, node, flush = true, local = true) {
        this._connection.rm(cid, node.path, flush, local).subscribe(() => {
            this.doLs(cid, node.parent);
        });
    }
    doMkdir(cid, name, parent, flush = true) {
        const path = parent.path + "/" + name;
        this._connection.mkDir(cid, path, flush).subscribe(() => {
            this.doLs(cid, parent);
        });
    }
    doRename(cid, node, newName, flush = true) {
        this._connection.mv(cid, node.path, node.parent.path + "/" + newName, flush).subscribe(() => {
            this.doLs(cid, node.parent);
        });
    }
    doCopy(cid, node, flush = true) {
        this._connection.cp(cid, node.path, node.path + " (copy)", flush).subscribe(() => {
            this.doLs(cid, node.parent);
        });
    }
    doGet(cid, node, flush = true) {
        this._connection.getAsResponse(cid, node.path, flush).subscribe((response) => __awaiter(this, void 0, void 0, function* () {
        }));
    }
    get ls() {
        return this._lsSubj;
    }
    get stat() {
        return this._statSubj;
    }
    get file() {
        return this._statSubj;
    }
}
exports.DriveService = DriveService;
