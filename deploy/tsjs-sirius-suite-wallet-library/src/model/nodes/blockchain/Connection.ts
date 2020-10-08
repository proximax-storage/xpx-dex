// import { BrowserStorage } from './browserStorage'
import { NetworkType } from "tsjs-xpx-chain-sdk/dist/src/model/blockchain/NetworkType";
import { BlockHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/BlockHttp';
import { ChainHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/ChainHttp';
import { UInt64 } from "tsjs-xpx-chain-sdk/dist/src/model/UInt64";
import { Utilities } from '../../../utils/Utilities';

export class Connection {
    private testing: boolean = false
    private static _currentNode: string = '';
    private static _nodeList: string[] = [];
    private static _height: UInt64 = null;
    private static _generationHash: string;
    private static _networkType: NetworkType;

    constructor() { 
    }

    /**
     *
     *
     * @private
     * @param {string} url
     * @param {number} [height=1]
     * @memberof Connection
     */
    private assignBlockInfokByHeight(url: string, height: number = 1) {
        return new Promise<boolean>((resolve, reject) => {
            const blockHttp = new BlockHttp(url);
            blockHttp.getBlockByHeight(height).subscribe(blockInfo => {
                this.height = blockInfo.height;
                this.generationHash = blockInfo.generationHash;
                this.networkType = blockInfo.networkType;
                resolve(true)
            }, error => reject(error));
        });
    }

    /**
     *
     *
     * @private
     * @memberof Connection
     */
    private selectBestNode() {
        return new Promise<{ node: string, height: UInt64 }>((resolve, reject) => {
            if (this.nodeList.length === 0) reject('You must add a node');
            const heights: Array<{ node: string, height: UInt64 }> = [];
            for (let node of this.nodeList) {
                this.getBlockchainHeight(node).then(x => {
                    heights.push({ node, height: x });
                    try {
                        const rangeNode = this.validateRangeNode(heights);
                        if (rangeNode) resolve(rangeNode);
                    } catch (error) {
                        reject(error)
                    }
                }).catch(error => {
                    heights.push({ node, height: null });
                    try {
                        const rangeNode = this.validateRangeNode(heights);
                        if (rangeNode) resolve(rangeNode);
                    } catch (error) {
                        reject(error)
                    }
                })
                /* const chainHttp = new ChainHttp(node);
                chainHttp.getBlockchainHeight().subscribe(x => {
                    heights.push({ node, height: x });
                    try {
                        const rangeNode = this.validateRangeNode(heights);
                        if (rangeNode) resolve(rangeNode);
                    } catch (error) {
                        reject(error)
                    }
                }, error => {
                    heights.push({ node, height: null });
                    try {
                        const rangeNode = this.validateRangeNode(heights);
                        if (rangeNode) resolve(rangeNode);
                    } catch (error) {
                        reject(error)
                    }
                }) */
            }
        });
    }

    /**
     *
     *
     * @private
     * @param {Array<{ node: string, height: number }>} heights
     * @returns
     * @memberof Connection
     */
    private validateRangeNode(heights: Array<{ node: string, height: UInt64 }>) {
        if (this.nodeList.length === heights.length) {
            const filtered = heights.filter(x => x.height)
            if (filtered.length > 0) {
                const response = filtered.sort((a, b) => { return (b.height && b.height.compact()) - (a.height && a.height.compact()) });
                if (response && response.length > 0 && response[0].height && response[0].height.compact() > 0) {
                    return response[0];
                }

                throw ('The node is synchronizing');
            } else {
                throw ('Please check the node or internet connection');
            }
        }

        return null;
    }

    /**
     * Returns the nodes that failed
     *
     * @memberof Connection
     */
    addNodeToList(nodes: string[]) {
        const nodesError = [];
        for (let node of nodes) {
            try {
                const urlNode = Utilities.validateURL(node);
                const nodeBuilded = `${urlNode.protocol}://${urlNode.domainIp}`
                if (!this.nodeList.find(n => n === nodeBuilded)) Connection._nodeList.push(nodeBuilded);
                else throw ('Node already exists');
            } catch (error) {
                nodesError.push({
                    node,
                    error: error
                });
            }
        }

        return nodesError;
    }

    /**
     *
     *
     * @memberof Connection
     */
    destroyDataNode() {
        this.height = null;
        this.generationHash = null;
        this.networkType = null;
        this.currentNode = '';
        Connection._nodeList = [];
        Utilities.logs('Values in connection, has be destroyed!')
    }

    /**
     *
     *
     * @param {string} [node]
     * @memberof Connection
     */
    selectNode(node?: string) {
        if (!this.testing) {
            this.testing = true
            return new Promise<boolean>((resolve, reject) => {
                Utilities.logs('Testing node....', node);
                if (node) {
                    const isValidURL = Utilities.buildNodeURL(node);
                    if (!isValidURL) reject(isValidURL);
                    this.assignBlockInfokByHeight(isValidURL).then(r => {
                        this.addNodeToList([isValidURL]);
                        this.currentNode = isValidURL;
                        this.testing = false
                        resolve(r);
                    }).catch(e => { 
                        this.testing = false
                        reject(e)
                    });
                } else {
                    this.selectBestNode().then(bestNode => {
                        this.assignBlockInfokByHeight(bestNode.node).then(r => {
                            this.currentNode = bestNode.node;
                            this.height = bestNode.height;
                            this.testing = false
                            resolve(r);
                        }).catch(e => {
                            this.testing = false
                            reject(e)
                        });
                    }).catch(e => {
                        this.testing = false
                        reject(e)
                    })
                }
            });
        }
    }

    /**
     *
     *
     * @param {string} node
     * @returns
     * @memberof Connection
     */
    getBlockchainHeight (node: string) {
        return new Promise<UInt64>((resolve, reject) => {
            const chainHttp = new ChainHttp(node);
            chainHttp.getBlockchainHeight().subscribe(x => {
                resolve(x)
            }, error => {
                reject(error)
            })
        });
    }

    /**
     *
     *
     * @memberof Connection
     */
    set currentNode(node: string) {
        Connection._currentNode = node;
    }

    /**
     *
     *
     * @readonly
     * @memberof Connection
     */
    set height(height: UInt64) {
        Connection._height = height;
    }

    /**
     *
     *
     * @readonly
     * @memberof Connection
     */
    set generationHash(generationHash: string) {
        Connection._generationHash = generationHash;
    }

    /**
     *
     *
     * @readonly
     * @memberof Connection
     */
    set networkType(networkType: NetworkType) {
        Connection._networkType = networkType;
    }

    /**
     *
     *
     * @returns
     * @memberof Connections
     */
    get currentNode() {
        return Connection._currentNode;
    }

    /**
     *
     *
     * @returns
     * @memberof Connections
     */
    get nodeList() {
        return Connection._nodeList;
    }

    /**
     *
     *
     * @readonly
     * @memberof Connection
     */
    get height() {
        return Connection._height;
    }

    /**
     *
     *
     * @readonly
     * @memberof Connection
     */
    get generationHash() {
        return Connection._generationHash;
    }

    /**
     *
     *
     * @readonly
     * @memberof Connection
     */
    get networkType() {
        return Connection._networkType;
    }
}