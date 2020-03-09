export const socketDbStore = {
  namespaced: true,
  state: {
    offersTx: [],
    newOffersTx: null,
    mosaicsInfOffer: []
  },
  mutations: {
    SOCKET_SET_OFFERS (state, data) {
      console.log('SOCKET_SET_OFFERS', data)
      state.offersTx = data
    },
    SOCKET_SET_NEW_OFFERS (state, data) {
      console.log('SET_NEW_OFFERS', data)
      state.newOffersTx = data
      state.offersTx.push(data)
    },
    SOCKET_SET_MOSAIC_INFO (state, data) {
      console.log('SOCKET_SET_MOSAIC_INFO', data)
      state.mosaicsInfOffer = data
    },
    EVENT_SET_MOSAIC_INFO (state, data) {
      console.log('EVENT_SET_MOSAIC_INFO', data)
      state.mosaicsInfOffer = data
    },
    SOCKET_RETURN_INSERT_OFFERT (state, data) {
      console.log('SOCKET_RETURN_INSERT_OFFERT', data)
    },
    SOCKET_RETURN_INSERT_MOSAIC_INFO (state, data) {
      // changes
      if (data['inserted'] > 0) {
        for (let index = 0; index < data['inserted']; index++) {
          const element = data['changes'][index]
          if (element['new_val']) {
            state.mosaicsInfOffer.push(element['new_val'])
          }
        }
      }
      console.log('SOCKET_RETURN_INSERT_MOSAIC_INFO', data)
    }
  },
  getters: {
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
    mosaicsInfOffer: state => state.mosaicsInfOffer
  },
  actions: {
    getOffertsTx: ({ commit, state }, params) => {
      params.io.emit('getOffertsTx', params.data)
    },
    getMoisaicsInfo: ({ commit, state }, params) => {
      params.io.emit('getMoisaicsInfo', params.data)
    },
    insertNewOffers: ({ commit, state }, params) => {
      params.io.emit('insertNewOffers', params.data)
    },
    insertMoisaicsInfo: ({ commit, state }, params) => {
      params.io.emit('insertMoisaicsInfo', params.data)
    }
  }
}
