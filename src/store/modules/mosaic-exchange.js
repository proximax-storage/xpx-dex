export const mosaicExchange = {
  namespaced: true,
  state: {
    exchange: null,
    dataAssets: null
  },
  getters: {
    exchange: state => state.exchange,
    dataAssets: state => state.dataAssets
  },
  mutations: {
    SET_EXCHANGE (state, data) {
      state.exchange = data
    },
    SET_DATA_ASSETS (state, data) {
      state.dataAssets = data
    }
  }
}
