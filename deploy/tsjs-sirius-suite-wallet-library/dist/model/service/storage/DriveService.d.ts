import { DriveFsHttp } from 'tsjs-xpx-dfms-api-http/dist/src/infrastructure/DriveFsHttp';
import { Subject } from 'rxjs';
import { Node } from '../../nodes/storage/Node';
export declare class DriveService {
    private _statSubj;
    private _lsSubj;
    private _connection;
    constructor(connection: DriveFsHttp);
    doStat(cid: string, path: string, parent: Node): void;
    doLs(cid: string, node: Node): void;
    doAdd(cid: string, parent: Node, name: string, body: any, flush?: boolean): void;
    doDelete(cid: string, node: Node, flush?: boolean, local?: boolean): void;
    doMkdir(cid: string, name: string, parent: Node, flush?: boolean): void;
    doRename(cid: string, node: Node, newName: string, flush?: boolean): void;
    doCopy(cid: string, node: Node, flush?: boolean): void;
    doGet(cid: string, node: Node, flush?: boolean): void;
    get ls(): Subject<Node[]>;
    get stat(): Subject<Node>;
    get file(): Subject<Node>;
}
