export const offersStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    offerSelected: [],
    offerAll: []
  },
  getters: {
    offerSelected: state => state.offerSelected,
    offerAll: state => state.offerAll
  },
  mutations: {
    SET_OFFER_SELECTED (state, data) {
      state.offerSelected = data
    },
    SET_OFFER_ALL (state, data) {
      state.offerAll = data
    },
    PUSH_OFFER_ALL (state, data) {
      state.offerAll.push(data)
    },
    DELETE_OFFER_ALL (state, idMosaic) {
      for (var i = 0; i < state.offerAll.length; i++) {
        if (state.offerAll[i].tableData.info.mosaicIdHex === idMosaic) {
          state.offerAll.splice(i, 1)
          break
        }
      }
    }
  },
  actions: {}
}
