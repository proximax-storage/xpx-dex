import { Connection } from "./Connection";
import { ContractClientHttp } from 'tsjs-xpx-dfms-api-http/dist/src/infrastructure/ContractClientHttp';
import { DriveFsHttp } from 'tsjs-xpx-dfms-api-http/dist/src/infrastructure/DriveFsHttp';
export declare class ApiConnection extends Connection {
    private _contractClientHttp;
    private _driveFsHttp;
    apiInstances(): void;
    get contractClientHttp(): ContractClientHttp;
    get driveFsHttp(): DriveFsHttp;
}
