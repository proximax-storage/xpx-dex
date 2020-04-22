export const mosaicExchange = {
  namespaced: true,
  state: {
    exchange: null,
    dataAssets: null,
    exchangeDelete: null
  },
  getters: {
    exchange: state => state.exchange,
    dataAssets: state => state.dataAssets,
    exchangeDelete: state => state.exchangeDelete
  },
  mutations: {
    SET_EXCHANGE (state, data) {
      state.exchange = data
    },
    SET_EXCHANGE_DELETE (state, data) {
      state.exchangeDelete = data
    },
    SET_DATA_ASSETS (state, data) {
      state.dataAssets = data
    }
  }
}
