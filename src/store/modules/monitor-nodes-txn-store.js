export const monitorNodesTxnStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    monitorHashs: []
  },
  getters: {
    filterHash: (state) => (transactions) => {
      return transactions.filter(t => state.monitorHashs.filter(m => m.hash === t.transactionInfo.hash))
    },
    getMonitorHashs: state => state.monitorHashs
  },
  mutations: {
    SET_MONITOR_HASH (state, data) {
      const filtered = state.monitorHashs.filter(x => x.hash !== data.hash)
      filtered.push(data)
      state.monitorHashs = filtered
    },
    REMOVE_MONITOR_HASH (state, hash) {
      console.log('REMOVE', hash)
      const filtered = state.monitorHashs.filter(x => x.hash !== hash)
      state.monitorHashs = filtered
    }
  }
}
