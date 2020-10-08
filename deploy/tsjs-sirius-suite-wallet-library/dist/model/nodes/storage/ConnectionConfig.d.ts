export declare type FetchAPI = WindowOrWorkerGlobalScope['fetch'];
export declare class ConnectionConfig {
    static basePath: string;
    static fetchApi: FetchAPI;
    static username: string | undefined;
    static password: string | undefined;
    static apiKey: ((name: string) => string) | undefined;
    static accessToken: ((name: string, scopes?: string[]) => string) | undefined;
    constructor();
    static set _basePath(value: string);
    static set _fetchApi(value: FetchAPI);
    static set _apiKey(value: ((name: string) => string));
    static set _accessToken(value: ((name: string, scopes?: string[]) => string));
    static auth(username: string, pass: string): void;
}
