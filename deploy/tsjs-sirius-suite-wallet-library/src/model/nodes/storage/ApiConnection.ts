import { Connection } from "./Connection";
import { ContractClientHttp } from 'tsjs-xpx-dfms-api-http/dist/src/infrastructure/ContractClientHttp';
import { DriveFsHttp } from 'tsjs-xpx-dfms-api-http/dist/src/infrastructure/DriveFsHttp';
export class ApiConnection extends Connection {
    private  _contractClientHttp: ContractClientHttp
    private  _driveFsHttp: DriveFsHttp

    /**
     *
     *
     * @memberof ApiConnection
     */
    apiInstances() {
        if (!this.config || this.config === "") throw (`The url cannot be empty when instantiating api nodes`);
        this._contractClientHttp = new ContractClientHttp(this.config)
        this._driveFsHttp = new DriveFsHttp(this.config)
    }
    get contractClientHttp() {
        return this._contractClientHttp
    }
    get driveFsHttp() {
        return this._driveFsHttp
    }

  }