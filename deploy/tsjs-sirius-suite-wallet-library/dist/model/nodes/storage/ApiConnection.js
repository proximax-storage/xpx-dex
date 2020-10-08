"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConnection = void 0;
const Connection_1 = require("./Connection");
const ContractClientHttp_1 = require("tsjs-xpx-dfms-api-http/dist/src/infrastructure/ContractClientHttp");
const DriveFsHttp_1 = require("tsjs-xpx-dfms-api-http/dist/src/infrastructure/DriveFsHttp");
class ApiConnection extends Connection_1.Connection {
    apiInstances() {
        if (!this.config || this.config === "")
            throw (`The url cannot be empty when instantiating api nodes`);
        this._contractClientHttp = new ContractClientHttp_1.ContractClientHttp(this.config);
        this._driveFsHttp = new DriveFsHttp_1.DriveFsHttp(this.config);
    }
    get contractClientHttp() {
        return this._contractClientHttp;
    }
    get driveFsHttp() {
        return this._driveFsHttp;
    }
}
exports.ApiConnection = ApiConnection;
