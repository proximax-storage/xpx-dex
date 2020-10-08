
import { ApiConnection } from '../model/nodes/storage/ApiConnection';
import { BasePath } from '../model/nodes/storage/BasePath'
test2()

function test1() {
    const basePath = BasePath.createPath('http', 'dfms-testnet1.so.xpxsirius.io', 6366, 'api/v1')
    const con = new ApiConnection(basePath)
    con.auth('test', 'qazwsxedc')
    con.apiInstances()
    con.contractClientHttp.ls().subscribe(d => {
        console.log(d)
    })
}

function test2() {
    const list = [
        new BasePath('http://dfms-testnet1.so.xpxsirius.io:6366', 'api/v1')
    ]
    BasePath.addPathList(list)
    const path = BasePath.selectPath()
    const con = new ApiConnection(path)
    con.apiInstances()
    console.log('conasdasds', con.config)
    con.contractClientHttp.ls().subscribe(d => {
        console.log(d)
    })

}