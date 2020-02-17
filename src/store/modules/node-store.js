export const nodeStore = {
  namespaced: true,
  state: {
    connectionNodes: {
      networkType: null,
      protocol: null,
      protocolWs: null,
      nodes: null
    },
    nodeSelected: null
  },
  getters: {
    nodeSelected: state => state.nodeSelected,
    connectionNodes: state => state.connectionNodes
  },
  mutations: {
    SET_NODE_SELECT (state, data) {
      state.nodeSelected = data
    },
    SET_CONNECTION_NODES (state, data) {
      state.connectionNodes = data
    }
  }
}
