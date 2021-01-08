// import Vue from 'vue'
import { TypeStatusNode } from 'tsjs-sirius-suite-wallet-library/dist/model/nodes/blockchain/Websocket'
// import { Utilities } from 'tsjs-sirius-suite-wallet-library/dist/utils/Utilities'
// import { NodeService } from '@/services/blockchain/node.service'

export const nodesStoreNew = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    currentHeight: 0,
    currentNode: '',
    generationHash: null,
    networkType: null,
    nodesList: [],
    customNodes: [],
    nodeStatus: TypeStatusNode.NODE_OFF,
    reconnect: false,
    stoppedByUser: false,
    retryConnection: 0
  },
  getters: {
    configHttp: (state, getters, rootState, rootGetters) => {
      return {
        headers: {
          Authorization: `Bearer ${rootGetters['accountStore/token']}`
        }
      }
    },
    currentHeight: state => state.currentHeight,
    currentNode: state => state.currentNode,
    generationHash: state => state.generationHash,
    networkType: state => state.networkType,
    nodesList: state => state.nodesList,
    nodeStatus: state => state.nodeStatus,
    customNodes: state => state.customNodes,
    blockchainNodes: (state, getters) => {
      return getters.nodesList.filter(n => n.node && n.identification_type === 1)
    },
    reconnect: state => state.reconnect,
    stoppedByUser: state => state.stoppedByUser,
    retryConnection: state => state.retryConnection
  },
  mutations: {
    ADD_RETRY_CONNECTION (state, value) {
      console.log('value', value)
      state.retryConnection = value
    },
    STOPPED_BY_USER (state, status) {
      state.stoppedByUser = status
    },
    ADD_NODES (state, data, toServer) {
      // console.log('data', data)
      const n = state.nodesList.slice()
      const nToSave = []
      if (data.nodes.length > 0) {
        data.nodes.forEach(element => {
          const nodeBuilded = `${data.protocol}://${element}`
          const exist = n.find(x => x === nodeBuilded)
          if (exist === undefined || exist === null) {
            nToSave.push(nodeBuilded)
            n.push(nodeBuilded)
          }
        })
      }
      // console.log('Lista de nodos', n)
      if (!data.toServer) {
        state.nodesList = n
        // return
      }

      // NodeService.saveNodes(nToSave[0])
      //   .then(() => (state.nodesList = n))
      //   .catch(e => console.log('Error --->', e))
    },
    SET_DATA_NODE (state, data) {
      // console.log('data', data)
      state.currentNode = data.uri
      state.currentHeight = data.height
      state.generationHash = data.generationHash
      state.networkType = Number(data.networkType)
    },
    SET_CURRENT_HEIGHT (state, currentHeight) {
      state.currentHeight = currentHeight
    },
    SET_CURRENT_NODE (state, node) {
      state.currentNode = node
    },
    SET_GENERATION_HASH (state, generationHash) {
      state.generationHash = generationHash
    },
    SET_NETWORK_TYPE (state, networkType) {
      state.networkType = networkType
    },
    SET_NODES_LIST (state, data) {
      state.nodesList = data
    },
    SET_STATUS_NODE (state, status) {
      // console.log('SET_STATUS_NODE', status)
      state.nodeStatus = status
    },
    RECONNECT (state, status) {
      state.reconnect = status
    }
  },
  actions: {
    searchNodes () {
      // NodeService.searchCustomNodes()
    },
    closeWebsocket ({ commit }, status = null) {
      commit('SET_CURRENT_HEIGHT', 0)
      commit('SET_CURRENT_NODE', '')
      commit('SET_GENERATION_HASH', 0)
      commit('SET_NETWORK_TYPE', null)
      commit('SET_STATUS_NODE', status || TypeStatusNode.NODE_OFF)
    }
  }
}
