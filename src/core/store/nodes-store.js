export const nodeStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    currentNode: null,
    currentBlock: null,
    nodesList: null,
    nodeIsLive: null,
    nodeStatus: ''
  },
  getters: {
    currentBlock: state => state.currentBlock,
    currentNode: state => state.currentNode,
    generationHash: state => (state.currentNode) ? state.currentNode.generationHash : '',
    networkType: state => (state.currentNode) ? state.currentNode.networkType : '',
    nodesList: state => state.nodesList,
    nodeStatus: state => state.nodeStatus
  },
  mutations: {
    SET_NODE_IS_LIVE (state, status) {
      state.nodeIsLive = status
    },
    SET_CURRENT_BLOCK (state, currentBlock) {
      state.currentNode.height = currentBlock
      state.currentBlock = currentBlock
    },
    SET_STATUS_NODE (state, status) {
      // empty is without use, 0 is down, 1 is up, 2 is connecting
      state.nodeStatus = status
    },
    SET_CURRENT_NODE (state, data) {
      state.currentNode = data
    },
    SET_NODES_LIST (state, data) {
      state.nodesList = data
    }
  },
  actions: {
    async initNodes ({
      commit
    }, connectionNodes) {
      commit('SET_STATUS_NODE', 2)
      const uri = this._vm.$websocketProvider.selectNode(connectionNodes.nodes, connectionNodes.uriSelected)
      this._vm.$blockchainProvider.instanceConnectionApi(uri, connectionNodes.protocol)
      this._vm.$blockchainProvider.getBlockInfo().subscribe(blockInfo => {
        const currentNode = {
          uri,
          height: null,
          generationHash: blockInfo.generationHash,
          networkType: blockInfo.networkType
        }
        commit('SET_CURRENT_NODE', currentNode)
        commit('SET_NODES_LIST', connectionNodes.nodes)
        // add websocket id
        if (this._vm.$modulesConfig.nodes.connectToWebsocket) this._vm.$websocketProvider.webSocketConnection(uri, connectionNodes.protocolWs)
        else commit('SET_STATUS_NODE', 1)
      }, () => {
        commit('SET_STATUS_NODE', 0)
      })
    },
    closeWebsocket ({
      commit
    }, status) {
      this._vm.$websocketProvider.closeConnection()
      commit('SET_CURRENT_BLOCK', 0)
      commit('SET_CURRENT_NODE', null)
      commit('SET_NODES_LIST', null)
      commit('SET_STATUS_NODE', status)
    }
  }
}
