
export declare type FetchAPI = WindowOrWorkerGlobalScope['fetch'];
const fetchApi = require('node-fetch');
export class ConnectionConfig {
    static basePath: string
    static fetchApi: FetchAPI = fetchApi
    static username: string | undefined;
    static password: string | undefined;
    static apiKey: ((name: string) => string) | undefined;
    static accessToken: ((name: string, scopes?: string[]) => string) | undefined;
    constructor() {
    }

    static set _basePath(value: string) {
        this.basePath = value;
    }
    static set _fetchApi(value: FetchAPI) {
        this.fetchApi = value;
    }
    static set _apiKey(value: ((name: string) => string)) {
        this.apiKey = value
    }
    static set _accessToken(value: ((name: string, scopes?: string[]) => string)) {
        this.accessToken = value
    }
    /**
     * 
     * @param username 
     * @param pass 
     */
    static auth(username: string, pass: string) {
        this.username = username
        this.password = pass
    }
}
