export const socketDbStore = {
  namespaced: true,
  state: {
    offersTx: [],
    newOffersTx: null,
    mosaicsInfOffer: [],
    loadingInfo: false,
    unchanged: []
  },
  mutations: {
    SOCKET_SET_OFFERS (state, data) {
      // console.log('SOCKET_SET_OFFERS', data)
      state.offersTx = data
    },
    SOCKET_SET_NEW_OFFERS (state, data) {
      // console.log('SET_NEW_OFFERS', data)
      state.newOffersTx = data
      state.offersTx.push(data)
    },
    SOCKET_SET_MOSAIC_INFO (state, data) {
      // console.log('SOCKET_SET_MOSAIC_INFO', data)
      state.mosaicsInfOffer = data
    },
    EVENT_SET_MOSAIC_INFO (state, data) {
      // console.log('EVENT_SET_MOSAIC_INFO', data)
      state.mosaicsInfOffer = data
    },
    EVENT_LOADING_MOSAIC_INFO (state, data) {
      // console.log('EVENT_LOADING_MOSAIC_INFO', data)
      state.loadingInfo = data
    },
    EVENT_UNCHANGED (state, data) {
      state.unchanged = data
    },
    SOCKET_RETURN_INSERT_OFFERT (state, data) {
      // console.log('SOCKET_RETURN_INSERT_OFFERT', data)
    },
    SOCKET_RETURN_INSERT_EXECUTE_OFFERS (state, data) {
      // console.log('RETURN_INSERT_EXECUTE_OFFERS', data)
    },
    SOCKET_RETURN_INSERT_MOSAIC_INFO (state, data) {
      state.unchanged = []
      // console.log('SOCKET_RETURN_INSERT_MOSAIC_INFO', data)
      const dataDb = data.dataDb
      // changes
      if (dataDb['inserted'] > 0) {
        for (let index = 0; index < dataDb['inserted']; index++) {
          const element = dataDb['changes'][index]
          if (element['new_val']) {
            state.unchanged.push(data.dataOffer)
            state.mosaicsInfOffer.push(element['new_val'])
          }
        }
      } else if (dataDb['unchanged'] > 0) {
        state.unchanged.push(data.dataOffer)
      }
      // console.log('SOCKET_RETURN_INSERT_MOSAIC_INFO', data)
    }
  },
  getters: {
    unchanged: state => state.unchanged,
    offersTx: state => state.offersTx,
    newOffersTx: state => state.newOffersTx,
    offers: state => {
      let offers = []
      if (state.offersTx) {
        for (let items of state.offersTx) {
          offers.push({ offer: items.offers })
        }
      }
      return offers
    },
    mosaicsInfOffer: state => state.mosaicsInfOffer,
    mosaicsInfOfferFromIdHex: state => iDhex => {
      return state.mosaicsInfOffer.filter(next => next.mosaicIdHex === iDhex)
    },
    loadingInfo: state => state.loadingInfo
  },
  actions: {
    getOffertsTx: ({ commit, state }, params) => {
      params.io.emit('getOffertsTx', params.data)
    },
    getMoisaicsInfo: ({ commit, state }, params) => {
      commit('EVENT_LOADING_MOSAIC_INFO', true)
      params.io.emit('getMoisaicsInfo', params.data)
    },
    insertNewOffers: ({ commit, state }, params) => {
      params.io.emit('insertNewOffers', params.data)
    },
    insertExecuteOffers: ({ commit, state }, params) => {
      // console.log('insertExecuteOffers params', params)
      params.io.emit('insertExecuteOffers', params.data)
    },
    insertMoisaicsInfo: ({ commit, state }, params) => {
      params.io.emit('insertMoisaicsInfo', params.data)
    },
    // app
    setMoisaicUnchanged: ({ commit, state }, params) => {
      commit('EVENT_SET_MOSAIC_INFO', params)
      // params.io.emit('insertMoisaicsInfo', params.data)
    }

  }
}
