"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
class Node {
    constructor(cid, stat, parent) {
        this.cid = cid;
        this.stat = stat;
        this.parent = parent;
    }
    get pathComponents() {
        const path = [this];
        let parent = this.parent;
        while (parent) {
            path.unshift(parent);
            parent = parent.parent;
        }
        return path;
    }
    get path() {
        const p = this.pathComponents;
        if (p.length > 0) {
            return p[0].stat.name + p.slice(1).map(n => n.stat.name).join("/");
        }
        else {
            return "";
        }
    }
}
exports.Node = Node;
