export declare type FetchAPI = WindowOrWorkerGlobalScope['fetch'];
import { ConnectionConfig } from './ConnectionConfig';
import { BasePath } from './BasePath';
export declare class Connection {
    constructor(basePath: BasePath);
    path(val: string): void;
    fetchApi(val: FetchAPI): void;
    auth(user: string, pass: string): void;
    get config(): ConnectionConfig;
    get basePath(): string;
}
