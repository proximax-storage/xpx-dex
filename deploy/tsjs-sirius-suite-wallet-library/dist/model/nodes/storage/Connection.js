"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const ConnectionConfig_1 = require("./ConnectionConfig");
class Connection {
    constructor(basePath) {
        this.path(basePath.build());
    }
    path(val) {
        ConnectionConfig_1.ConnectionConfig._basePath = val;
    }
    fetchApi(val) {
        ConnectionConfig_1.ConnectionConfig._fetchApi = val;
    }
    auth(user, pass) {
        ConnectionConfig_1.ConnectionConfig.auth(user, pass);
    }
    get config() {
        return ConnectionConfig_1.ConnectionConfig;
    }
    get basePath() {
        return ConnectionConfig_1.ConnectionConfig.basePath;
    }
}
exports.Connection = Connection;
