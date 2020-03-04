export const socketDbStore = {
  namespaced: true,
  state: {
    offersTx: null
  },
  mutations: {
    SOCKET_SET_OFFERS (state, data) {
      console.log('SOCKET_SET_OFFERS', data)
      state.offersTx = data
    },
    SOCKET_SET_NEW_OFFERS (state, data) {
      console.log('SOCKET_SET_NEW_OFFERS', data)
    }
  },
  getters: { offersTx: state => state.offersTx },
  actions: {
    getOffertsTx: ({ commit, state }, params) => {
      params.io.emit('getOffertsTx', params.data)
    },
    emiterlik: ({ commit, state }, params) => {
      params.io.emit('emiterlik', params.data)
    }
  }
}
