
import { DriveFsHttp } from 'tsjs-xpx-dfms-api-http/dist/src/infrastructure/DriveFsHttp';
import { BehaviorSubject, Subject } from 'rxjs';
// import * as streamSaver from 'streamsaver';
import { Node } from '../../nodes/storage/Node'
export class DriveService {
    private _statSubj = new Subject<Node>();
    private _lsSubj = new Subject<Node[]>();
    private _connection: DriveFsHttp
    constructor(connection: DriveFsHttp) {
        this._connection = connection
    }
    public doStat(cid: string, path: string, parent: Node) {
        this._connection.stat(cid, path).subscribe(stat => {
            this._statSubj.next(new Node(cid, stat, parent))
        });
    }
    public doLs(cid: string, node: Node) {
        this._connection.ls(cid, node.path).subscribe(stats => this._lsSubj.next(stats.map(stat => new Node(cid, stat, node))));
    }
    public doAdd(cid: string, parent: Node, name: string, body: any, flush = true) {
        // TODO: upload progress
        this._connection.add(cid, parent.path + "/" + name, body, flush).subscribe(() => {
            this.doLs(cid, parent);
        });
    }

    public doDelete(cid: string, node: Node, flush = true, local = true) {
        this._connection.rm(cid, node.path, flush, local).subscribe(() => {
            this.doLs(cid, node.parent);
        })
    }

    public doMkdir(cid: string, name: string, parent: Node, flush = true) {
        const path = parent.path + "/" + name;
        this._connection.mkDir(cid, path, flush).subscribe(() => {
            this.doLs(cid, parent);
        })
    }
    public doRename(cid: string, node: Node, newName: string, flush = true) {
        this._connection.mv(cid, node.path, node.parent.path + "/" + newName, flush).subscribe(() => {
            this.doLs(cid, node.parent);
        });
    }

    public doCopy(cid: string, node: Node, flush = true) {
        this._connection.cp(cid, node.path, node.path + " (copy)", flush).subscribe(() => {
            this.doLs(cid, node.parent);
        });
    }

    public doGet(cid: string, node: Node, flush = true) {
        this._connection.getAsResponse(cid, node.path, flush).subscribe(async response => {
            // const fileStream = streamSaver.createWriteStream(node.stat.name + '.tar', {
            //     // size: 22, // (optional) Will show progress
            //     // writableStrategy: undefined, // (optional)
            //     // readableStrategy: undefined  // (optional)
            // }) as WritableStream;
            // const readableStream = response.body;

            // // more optimized
            // // if (window.WritableStream && readableStream.pipeTo) {
            // //   return readableStream.pipeTo(fileStream)
            // //     .then(() => console.log('done writing'))
            // // }

            // const writer = fileStream.getWriter();
            // const reader = readableStream.getReader();

            // const totalLength = response.headers.get("Content-Length");
            // let receivedLength = 0;
            // const pump = () => reader.read()
            //     .then(res => {
            //         receivedLength += (res.value ? res.value.length : 0);
            //         console.log("received " + receivedLength + " of total " + totalLength);
            //         return res.done
            //             ? writer.close()
            //             : writer.write(res.value).then(pump) // NOTE: if the server feeds the data too quickly (i.e. service running on loopback)
            //         // and the writer can not keep the pace, it gets loaded into memory - OOM is imminent
            //         // - I had to limit my testing service to 20Mbps via nginx
            //     });
            // pump()
        })
    }

    public get ls() {
        return this._lsSubj;
    }

    public get stat() {
        return this._statSubj;
    }
    public get file() {
        return this._statSubj;
    }
}