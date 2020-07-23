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
      return state.namespaces.sort((a, b) => {
        if (a.namespaceInfo && b.namespaceInfo) {
          return (
            a.namespaceName.name > b.namespaceName.name) ? 1 : ((b.namespaceName.name > a.namespaceName.name) ? -1 : 0
            )
        }
      }
      ).filter(
        next => {
          if (next.namespaceInfo) { return next.namespaceInfo.owner.address['address'] === address }
        }
      )
    }
  },
  mutations: {
    SET_NAMESPACES (state, data) {
      state.namespaces = data
    }
  }
}
