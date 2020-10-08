import {Stat } from 'tsjs-xpx-dfms-api-http/dist/src/model/Stat';
export class Node {
    constructor(
        public cid: string,
        public stat: Stat,
        public parent: Node,
    ) { }

    public get pathComponents() {
        const path: Node[] = [this];
        let parent = this.parent;
        while (parent) {
            path.unshift(parent);
            parent = parent.parent;
        }
        return path;
    }

    public get path() {
        const p = this.pathComponents;
        if (p.length > 0) {
            return p[0].stat.name + p.slice(1).map(n => n.stat.name).join("/");
        } else {
            return "";
        }
    }
}