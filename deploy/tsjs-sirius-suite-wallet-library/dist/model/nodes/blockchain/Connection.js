"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const BlockHttp_1 = require("tsjs-xpx-chain-sdk/dist/src/infrastructure/BlockHttp");
const ChainHttp_1 = require("tsjs-xpx-chain-sdk/dist/src/infrastructure/ChainHttp");
const Utilities_1 = require("../../../utils/Utilities");
class Connection {
    constructor() {
        this.testing = false;
    }
    assignBlockInfokByHeight(url, height = 1) {
        return new Promise((resolve, reject) => {
            const blockHttp = new BlockHttp_1.BlockHttp(url);
            blockHttp.getBlockByHeight(height).subscribe(blockInfo => {
                this.height = blockInfo.height;
                this.generationHash = blockInfo.generationHash;
                this.networkType = blockInfo.networkType;
                resolve(true);
            }, error => reject(error));
        });
    }
    selectBestNode() {
        return new Promise((resolve, reject) => {
            if (this.nodeList.length === 0)
                reject('You must add a node');
            const heights = [];
            for (let node of this.nodeList) {
                this.getBlockchainHeight(node).then(x => {
                    heights.push({ node, height: x });
                    try {
                        const rangeNode = this.validateRangeNode(heights);
                        if (rangeNode)
                            resolve(rangeNode);
                    }
                    catch (error) {
                        reject(error);
                    }
                }).catch(error => {
                    heights.push({ node, height: null });
                    try {
                        const rangeNode = this.validateRangeNode(heights);
                        if (rangeNode)
                            resolve(rangeNode);
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            }
        });
    }
    validateRangeNode(heights) {
        if (this.nodeList.length === heights.length) {
            const filtered = heights.filter(x => x.height);
            if (filtered.length > 0) {
                const response = filtered.sort((a, b) => { return (b.height && b.height.compact()) - (a.height && a.height.compact()); });
                if (response && response.length > 0 && response[0].height && response[0].height.compact() > 0) {
                    return response[0];
                }
                throw ('The node is synchronizing');
            }
            else {
                throw ('Please check the node or internet connection');
            }
        }
        return null;
    }
    addNodeToList(nodes) {
        const nodesError = [];
        for (let node of nodes) {
            try {
                const urlNode = Utilities_1.Utilities.validateURL(node);
                const nodeBuilded = `${urlNode.protocol}://${urlNode.domainIp}`;
                if (!this.nodeList.find(n => n === nodeBuilded))
                    Connection._nodeList.push(nodeBuilded);
                else
                    throw ('Node already exists');
            }
            catch (error) {
                nodesError.push({
                    node,
                    error: error
                });
            }
        }
        return nodesError;
    }
    destroyDataNode() {
        this.height = null;
        this.generationHash = null;
        this.networkType = null;
        this.currentNode = '';
        Connection._nodeList = [];
        Utilities_1.Utilities.logs('Values in connection, has be destroyed!');
    }
    selectNode(node) {
        if (!this.testing) {
            this.testing = true;
            return new Promise((resolve, reject) => {
                Utilities_1.Utilities.logs('Testing node....', node);
                if (node) {
                    const isValidURL = Utilities_1.Utilities.buildNodeURL(node);
                    if (!isValidURL)
                        reject(isValidURL);
                    this.assignBlockInfokByHeight(isValidURL).then(r => {
                        this.addNodeToList([isValidURL]);
                        this.currentNode = isValidURL;
                        this.testing = false;
                        resolve(r);
                    }).catch(e => {
                        this.testing = false;
                        reject(e);
                    });
                }
                else {
                    this.selectBestNode().then(bestNode => {
                        this.assignBlockInfokByHeight(bestNode.node).then(r => {
                            this.currentNode = bestNode.node;
                            this.height = bestNode.height;
                            this.testing = false;
                            resolve(r);
                        }).catch(e => {
                            this.testing = false;
                            reject(e);
                        });
                    }).catch(e => {
                        this.testing = false;
                        reject(e);
                    });
                }
            });
        }
    }
    getBlockchainHeight(node) {
        return new Promise((resolve, reject) => {
            const chainHttp = new ChainHttp_1.ChainHttp(node);
            chainHttp.getBlockchainHeight().subscribe(x => {
                resolve(x);
            }, error => {
                reject(error);
            });
        });
    }
    set currentNode(node) {
        Connection._currentNode = node;
    }
    set height(height) {
        Connection._height = height;
    }
    set generationHash(generationHash) {
        Connection._generationHash = generationHash;
    }
    set networkType(networkType) {
        Connection._networkType = networkType;
    }
    get currentNode() {
        return Connection._currentNode;
    }
    get nodeList() {
        return Connection._nodeList;
    }
    get height() {
        return Connection._height;
    }
    get generationHash() {
        return Connection._generationHash;
    }
    get networkType() {
        return Connection._networkType;
    }
}
exports.Connection = Connection;
Connection._currentNode = '';
Connection._nodeList = [];
Connection._height = null;
