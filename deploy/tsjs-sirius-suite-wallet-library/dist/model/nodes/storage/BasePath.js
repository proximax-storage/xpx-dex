"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePath = void 0;
const Utilities_1 = require("../../../utils/Utilities");
class BasePath {
    constructor(path, pre = 'api/v1') {
        this._path = path;
        this._pre = pre;
    }
    static addPathList(basePathList) {
        const nodesError = [];
        for (let basePat of basePathList) {
            try {
                if (!BasePath._basePathList.find(n => n._path === basePat._path))
                    BasePath._basePathList.push(basePat);
                else
                    throw ('Path already exists');
            }
            catch (error) {
                nodesError.push({
                    basePat,
                    error: error
                });
            }
        }
        return nodesError;
    }
    build() {
        return `${this._path}/${this._pre}`;
    }
    slice() {
        if (!this._path || this._path === undefined)
            throw new Error('You must add a path');
        const v = Utilities_1.Utilities.validateURL(this._path);
        return {
            protocol: v.protocol,
            domainIp: v.domainIp,
            port: Number(v.port),
            pre: this._pre
        };
    }
    static createPath(protocol, domainIp, port, pre) {
        const url = `${protocol}://${domainIp}:${port}`;
        return this.createPathFromUrl(url, pre);
    }
    static createPathFromUrl(url, pre) {
        try {
            const u = Utilities_1.Utilities.validateURL(url);
            return new BasePath(`${u.protocol}://${u.domainIp}:${u.port}`, pre);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    static selectPath(basePath) {
        if (basePath) {
            BasePath.addPathList([basePath]);
            return new BasePath(basePath.path, basePath._pre);
        }
        if (BasePath._basePathList.length === 0)
            throw new Error('You must add a path');
        return BasePath._basePathList[Math.floor(Math.random() * BasePath._basePathList.length)];
    }
    static get pathList() {
        return BasePath._basePathList;
    }
    get path() {
        return this._path;
    }
    get pre() {
        return this._pre;
    }
}
exports.BasePath = BasePath;
BasePath._basePathList = [];
