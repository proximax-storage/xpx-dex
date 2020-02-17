export const namespaceStore = {
  namespaced: true,
  state: {
    namespaces: [
      {
        id: null,
        idToHex: null,
        namespaceInfo: null,
        namespaceName: null
      }
    ]
  },
  getters: {
    namespaces: state => state.namespaces,
    namespacesFromAddress: state => address => {
      return state.namespaces.filter(
        next => next.namespaceInfo.owner.address['address'] === address
      )
    }
  },
  mutations: {
    SET_NAMESPACES (state, data) {
      console.log('SET_NAMESPACES', data)
      state.namespaces = data
    }
  }
}
