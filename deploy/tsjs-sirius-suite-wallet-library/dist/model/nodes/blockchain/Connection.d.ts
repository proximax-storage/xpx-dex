import { NetworkType } from "tsjs-xpx-chain-sdk/dist/src/model/blockchain/NetworkType";
import { UInt64 } from "tsjs-xpx-chain-sdk/dist/src/model/UInt64";
export declare class Connection {
    private testing;
    private static _currentNode;
    private static _nodeList;
    private static _height;
    private static _generationHash;
    private static _networkType;
    constructor();
    private assignBlockInfokByHeight;
    private selectBestNode;
    private validateRangeNode;
    addNodeToList(nodes: string[]): {
        node: string;
        error: any;
    }[];
    destroyDataNode(): void;
    selectNode(node?: string): Promise<boolean>;
    getBlockchainHeight(node: string): Promise<UInt64>;
    set currentNode(node: string);
    set height(height: UInt64);
    set generationHash(generationHash: string);
    set networkType(networkType: NetworkType);
    get currentNode(): string;
    get nodeList(): string[];
    get height(): UInt64;
    get generationHash(): string;
    get networkType(): NetworkType;
}
