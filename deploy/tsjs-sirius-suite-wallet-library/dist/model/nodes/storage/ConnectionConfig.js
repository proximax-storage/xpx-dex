"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionConfig = void 0;
const fetchApi = require('node-fetch');
class ConnectionConfig {
    constructor() {
    }
    static set _basePath(value) {
        this.basePath = value;
    }
    static set _fetchApi(value) {
        this.fetchApi = value;
    }
    static set _apiKey(value) {
        this.apiKey = value;
    }
    static set _accessToken(value) {
        this.accessToken = value;
    }
    static auth(username, pass) {
        this.username = username;
        this.password = pass;
    }
}
exports.ConnectionConfig = ConnectionConfig;
ConnectionConfig.fetchApi = fetchApi;
