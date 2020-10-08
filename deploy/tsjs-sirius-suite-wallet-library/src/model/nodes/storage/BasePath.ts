import { Utilities } from '../../../utils/Utilities';
export class BasePath {
    private readonly _path: string
    private readonly _pre: string
    private static _basePathList: BasePath[] = []
    constructor(path: string, pre: string = 'api/v1') {
        this._path = path
        this._pre = pre
    }
    /**
     * Returns the Path that failed
     *
     * @memberof Connection
     */
    static addPathList(basePathList: BasePath[]) {
        const nodesError = [];
        for (let basePat of basePathList) {
            try {
                if (!BasePath._basePathList.find(n => n._path === basePat._path)) BasePath._basePathList.push(basePat);
                else throw ('Path already exists');
            } catch (error) {
                nodesError.push({
                    basePat,
                    error: error
                });
            }
        }
        return nodesError
    }
    build(): string {
        return `${this._path}/${this._pre}`
    }
    slice(): SliceUrl {
        if (!this._path || this._path === undefined) throw new Error('You must add a path')
        const v = Utilities.validateURL(this._path)
        return {
            protocol: v.protocol,
            domainIp: v.domainIp,
            port: Number(v.port),
            pre: this._pre
        }
    }

    static createPath(protocol: string, domainIp: string, port: number, pre: string): BasePath {
        const url = `${protocol}://${domainIp}:${port}`;
        return this.createPathFromUrl(url, pre);
    }
    static createPathFromUrl(url:string , pre?:string):BasePath {
         try {
            const u = Utilities.validateURL(url);
               return new BasePath(
                 `${u.protocol}://${u.domainIp}:${u.port}`,
                 pre
               );
         } catch (error) {
           throw new Error(error);
         }

    }

    static selectPath(basePath?: BasePath): BasePath {
        if (basePath) {
            BasePath.addPathList([basePath])
            return  new BasePath(basePath.path, basePath._pre)
        }
        if (BasePath._basePathList.length === 0) throw new Error('You must add a path')
        return BasePath._basePathList[Math.floor(Math.random() * BasePath._basePathList.length)];
    }

    static get pathList() {
        return BasePath._basePathList
    }
     get path (){
        return this._path
    }
     get pre (){
        return this._pre
    }

}

export interface SliceUrl {
    protocol: string,
    domainIp: string,
    port: number,
    pre: string
}
