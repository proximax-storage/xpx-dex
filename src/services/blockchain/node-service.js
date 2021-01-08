import store from '@/store'
import Vue from 'vue'
// import { Subscription } from 'rxjs'
import { ApiConnection } from 'tsjs-sirius-suite-wallet-library/dist/model/nodes/blockchain/ApiConnection'
import { WebsocketConnection, TypeStatusNode } from 'tsjs-sirius-suite-wallet-library/dist/model/nodes/blockchain/Websocket'
import { Address } from 'tsjs-xpx-chain-sdk/dist/src/model/account/Address'
import { WebsocketService } from '@/services/blockchain/websocket-service'
import Msg from '@/services/messages'

export class NodeService {
  static timeoutLimitConnection = null
  static _objApiConnection = null
  static _objWebsocketConnection = null
  static statusNodeSubscription = null
  static connecto = null

  /**
   * Destroy subscription observable
   *
   * @private
   * @static
   * @memberof NodeService
   */
  static destroySubscription () {
    if (this.statusNodeSubscription) this.statusNodeSubscription.unsubscribe()
  }

  /**
   * Init connection to api and websocket
   *
   * @static
   * @param {string} [node=null]
   * @memberof NodeService
   */
  static connect (node = null) {
    store.commit('nodesStoreNew/STOPPED_BY_USER', false)
    if (!store.getters['walletStore/currentWallet'].accounts) this.closeConnection()
    if (store.getters['nodesStoreNew/nodeStatus'] !== TypeStatusNode.NODE_CONNECTING) {
      this.initTimeoutLimitConnection()
      this.closeConnection(TypeStatusNode.NODE_CONNECTING)
      store.commit('nodesStoreNew/SET_CURRENT_NODE', node)
      this.connectionSocket()
    }
  }

  static connectionSocket () {
    if (!store.getters['walletStore/currentWallet'].accounts) {
      console.error('Usted no posee una llave pública')
      return
    }
    this.initObjApiConnection()
    // Instance connection
    const blockchainNodes = store.getters['nodesStoreNew/nodesList']
    this.objApiConnection.addNodeToList(blockchainNodes)
    const node = store.getters['nodesStoreNew/currentNode']
    this.objApiConnection
      .selectNode(node)
      .then(() => {
        store.commit('nodesStoreNew/SET_DATA_NODE', {
          uri: this.objApiConnection?.currentNode || '',
          height: this.objApiConnection.height ? this.objApiConnection.height?.compact() : null,
          generationHash: this.objApiConnection.generationHash,
          networkType: this.objApiConnection.networkType
        })

        this.initObjWebsocketConnection()
        this.subscribeStatusNode()
        this.objWebsocketConnection
          .connect(true)
          .then(() => {
            store.commit('nodesStoreNew/ADD_RETRY_CONNECTION', 0)
            this.objApiConnection.apiInstances()
            const address = store.getters['walletStore/currentWallet'].accounts.map(x => new Address(x.simpleWallet.address.address, x.simpleWallet.address.networkType))
            this.objWebsocketConnection.monitorAllChannels(address)
            WebsocketService.subscribeAllChannels(this.objWebsocketConnection)
            store.commit('nodesStoreNew/SET_STATUS_NODE', TypeStatusNode.NODE_ACTIVE)
          })
          .catch(e => {
            console.error('Error to connect', e)
            this.objWebsocketConnection.closeConnectionWs()
            this.objApiConnection.destroyDataNode()
          })
      })
      .catch(error => console.error('Ha ocurrido un error:', error))
  }

  /**
   *
   *
   * @static
   * @memberof NodeService
   */
  static initTimeoutLimitConnection () {
    console.log('\n initTimeoutLimitConnection \n')
    console.log('check is open ', (this.objWebsocketConnection && this.objWebsocketConnection.checkIsOpenConnection()))
    const _self = this
    this.timeoutLimitConnection = setTimeout(function () {
      console.log('validate time out.....')
      try {
        _self.clearTimeoutLimitConnection()
        console.log('check is open ', (_self.objWebsocketConnection && _self.objWebsocketConnection.checkIsOpenConnection()))
        if (!(_self.objWebsocketConnection && _self.objWebsocketConnection.checkIsOpenConnection())) {
          console.log('close connection, connection lazy!')
          _self.closeConnection()
        }
      } catch (error) {
        _self.closeConnection()
      }
    }, 18000)
  }
  /**
   *
   *
   * @static
   * @memberof NodeService
   */
  static clearTimeoutLimitConnection () {
    if (this.timeoutLimitConnection) {
      clearTimeout(this.timeoutLimitConnection)
      this.timeoutLimitConnection = null
    }
  }
  /**
   *
   *
   * @static
   * @param {number} [statusNode=TypeStatusNode.NODE_OFF]
   * @param  [showMessage=false]
   * @param {string} [message=null]
   * @param  [isError=true]
   * @memberof NodeService
   */
  static closeConnection (statusNode = TypeStatusNode.NODE_OFF, showMessage = false, message = null, isError = true) {
    store.dispatch('nodesStoreNew/closeWebsocket', statusNode)
    this.destroySubscription()
    // WebsocketService.destroySubscriptions()
    // Close websocket connection and destroy data node
    if (this.objWebsocketConnection !== null && this.objWebsocketConnection !== undefined) {
      this.objWebsocketConnection.closeConnectionWs()
      this.objWebsocketConnection.destroyDataNode()
      this._objWebsocketConnection = null
    }
    // Destroy api connection
    if (this.objApiConnection !== null && this.objApiConnection !== undefined) {
      this._objApiConnection = null
    }
    // showMessage snackbar
    if (showMessage) {
      store.commit('SHOW_SNACKBAR', {
        snackbar: true,
        text: message,
        color: isError ? 'errorIntense' : ''
      })
    }
  }

  /**
   *
   *
   * @static
   * @param {string} node
   * @memberof NodeService
   */
  static deleteNodes (node) {
    // const filtered = store.getters['nodesStoreNew/nodesList'].filter(x => x.node !== node)
    // Vue.axios
    //   .delete(`/api/nodes/delete/${node}`, store.getters['nodesStoreNew/configHttp'])
    //   .then(() => store.commit('nodesStoreNew/SET_NODES_LIST', filtered))
    //   .catch(e => console.log('error:', e))
  }

  /**
   *
   *
   * @static
   * @returns
   * @memberof NodeService
   */
  static initObjApiConnection () {
    this._objApiConnection = new ApiConnection()
  }

  /**
   *
   *
   * @static
   * @memberof NodeService
   */
  static initObjWebsocketConnection () {
    this._objWebsocketConnection = new WebsocketConnection()
    // WebsocketConnection.nodesConfig.timeOutNewBlocks = 300
    // WebsocketConnection.nodesConfig.timeValidateSynchronization = 300
  }

  /**
   *
   *
   * @static
   * @returns
   * @memberof NodeService
   */
  static saveNodes (dataNode) {
    return Vue.axios.post(
      '/api/nodes/create',
      {
        description: dataNode.description,
        node: dataNode.node,
        identification_type: dataNode.identificationType
      },
      store.getters['nodesStoreNew/configHttp']
    )
  }

  /**
   *
   *
   * @static
   * @memberof NodeService
   */
  static subscribeStatusNode () {
    this.destroySubscription()
    if (this.objWebsocketConnection) {
      this.statusNodeSubscription = this.objWebsocketConnection.statusNode.subscribe(status => {
        store.commit('nodesStoreNew/SET_STATUS_NODE', status)
        const stuck = status === TypeStatusNode.NODE_STUCK
        const sync = status === TypeStatusNode.NODE_SYNCHRONIZING
        const off = status === TypeStatusNode.NODE_OFF
        if (stuck || sync || off) {
          this.destroySubscription()
          if (this.objWebsocketConnection && this.objWebsocketConnection.checkIsOpenConnection()) {
            if (stuck || sync) {
              store.commit('SHOW_SNACKBAR', {
                snackbar: true,
                text: stuck ? Msg.nodes.error.stuck : Msg.nodes.error.sync,
                color: 'errorIntense'
              })
            }

            this.closeConnection()
          }
        }
      })
    }
  }

  /**
   *
   *
   * @static
   * @returns
   * @memberof NodeService
   */
  static searchCustomNodes () {
    return Vue.axios.get('/api/nodes/get-all', store.getters['nodesStoreNew/configHttp'])
  }

  /**
   *
   *
   * @readonly
   * @static
   * @memberof NodeService
   */
  static get objApiConnection () {
    return this._objApiConnection
  }

  /**
   *
   *
   * @readonly
   * @static
   * @memberof NodeService
   */
  static get objWebsocketConnection () {
    return this._objWebsocketConnection
  }
}
