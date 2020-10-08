// import { ContractClientHttp, DriveFsHttp } from 'tsjs-xpx-dfms-api-http';
export declare type FetchAPI = WindowOrWorkerGlobalScope['fetch'];
import { ConnectionConfig } from './ConnectionConfig';
import {BasePath} from  './BasePath'
export class Connection {
  constructor(basePath:BasePath) {
    this.path(basePath.build())
  }

  path(val: string) {
    ConnectionConfig._basePath = val
  }
  fetchApi(val: FetchAPI) {
    ConnectionConfig._fetchApi = val
  }
  auth(user: string, pass: string) {
    ConnectionConfig.auth(user, pass)
  }

  get config(): ConnectionConfig {
    return ConnectionConfig
  }
  get basePath() {
    return ConnectionConfig.basePath
  }
}