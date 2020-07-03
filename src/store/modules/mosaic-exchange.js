export const mosaicExchange = {
  namespaced: true,
  state: {
    exchange: null,
    dataAssets: null,
    exchangeDelete: null,
    expire: 0
  },
  getters: {
    exchange: state => state.exchange,
    dataAssets: state => state.dataAssets,
    exchangeDelete: state => state.exchangeDelete,
    expire: state => state.expire
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
    },
    SET_EXPIRE (state, data) {
      state.expire = data
    }
  }
}
