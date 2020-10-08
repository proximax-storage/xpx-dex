import { ApiConnection } from '../model/nodes/blockchain/ApiConnection';
import { WebsocketConnection } from '../model/nodes/blockchain/Websocket';
import { PublicAccount } from 'tsjs-xpx-chain-sdk/dist/src/model/account/PublicAccount';
import { NetworkType } from 'tsjs-xpx-chain-sdk/dist/src/model/blockchain/NetworkType';

test()
function test() {
    const objApiConnection: ApiConnection = new ApiConnection();
    const nodesFailed = objApiConnection.addNodeToList([
        'https://bctestnet2.brimstone.xpxsirius.io'
    ]);

    console.log('nodesFailed', nodesFailed)
    objApiConnection.selectNode().then(node => {
        console.log('hola mundo')
        console.log('\n-----------------------------------------------------------------------------');
        console.log('Height:', (objApiConnection.height) ? objApiConnection.height.compact() : null);
        console.log('Generation hash:', objApiConnection.generationHash);
        console.log('Network type:', objApiConnection.networkType);
        console.log('Current node:', objApiConnection.currentNode);
        console.log('-----------------------------------------------------------------------------\n');
        const objWebsocket: WebsocketConnection = new WebsocketConnection();
        objWebsocket.connect().then(x => {
            objApiConnection.apiInstances();
            const publicAccount = PublicAccount.createFromPublicKey('68EDE8A2CBEF1B8BD40519B32952EDD2F384093187A77ED3FA376828C19EF8C3', NetworkType.TEST_NET)
            objWebsocket.monitorAllChannels([publicAccount.address])
        }).catch(e => {
            console.log('Error to connect', e)
            objWebsocket.closeConnectionWs();
            objApiConnection.destroyDataNode();
        });
    }).catch(error => console.log('Ha ocurrido un error:', error));
}