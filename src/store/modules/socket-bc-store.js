export const socketBcStore = {
  namespaced: true,
  state: {
    statusTx: {
      type: null,
      hash: null
    }
  },
  mutations: {
    SET_STATUS_TX (state, data) {
      console.log('newstatusTx', data)
      state.statusTx = data
    }
  },
  getters: {
    statusTx: state => state.statusTx,
    statusTxFormHash: state => hash => {
      return state.statusTx.filter(next => next.hash === hash)
    }
  }
}
