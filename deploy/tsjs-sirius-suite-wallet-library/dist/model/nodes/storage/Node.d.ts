import { Stat } from 'tsjs-xpx-dfms-api-http/dist/src/model/Stat';
export declare class Node {
    cid: string;
    stat: Stat;
    parent: Node;
    constructor(cid: string, stat: Stat, parent: Node);
    get pathComponents(): Node[];
    get path(): string;
}
