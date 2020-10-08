export declare class BasePath {
    private readonly _path;
    private readonly _pre;
    private static _basePathList;
    constructor(path: string, pre?: string);
    static addPathList(basePathList: BasePath[]): {
        basePat: BasePath;
        error: any;
    }[];
    build(): string;
    slice(): SliceUrl;
    static createPath(protocol: string, domainIp: string, port: number, pre: string): BasePath;
    static createPathFromUrl(url: string, pre?: string): BasePath;
    static selectPath(basePath?: BasePath): BasePath;
    static get pathList(): BasePath[];
    get path(): string;
    get pre(): string;
}
export interface SliceUrl {
    protocol: string;
    domainIp: string;
    port: number;
    pre: string;
}
