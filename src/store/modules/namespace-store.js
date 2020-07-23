export const namespaceStore = {
  namespaced: true,
  state: {
    loading: true,
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
    loading: state => state.loading,
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
    LOADING (state, data) {
      state.loading = data
    },
    SET_NAMESPACES (state, data) {
      state.namespaces = data
      state.loading = false
    }
  }
}
