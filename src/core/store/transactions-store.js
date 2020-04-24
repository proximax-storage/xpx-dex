export const transactionsStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    aggregateBondedAdded: [],
    aggregateBondedRemoved: [],
    blockInfo: [],
    cosignatureAdded: [],
    confirmed: [],
    unconfirmedAdded: [],
    unconfirmedRemoved: [],
    status: [],
    monitorHashs: []
  },
  getters: {
    aggregateBondedAdded: state => state.aggregateBondedAdded,
    aggregateBondedRemoved: state => state.aggregateBondedRemoved,
    blockInfo: (state) => (height) => {
      return state.blockInfo.find(b => b.height.compact() === height)
    },
    cosignatureAdded: state => state.cosignatureAdded,
    confirmed: state => state.confirmed,
    unconfirmedAdded: state => state.unconfirmedAdded,
    unconfirmedRemoved: state => state.unconfirmedRemoved,
    status: state => state.status,
    filterHash: (state) => (transactions) => {
      return transactions.filter(t => state.monitorHashs.filter(m => m.hash === t.transactionInfo.hash))
    },
    getMonitorHashs: state => state.monitorHashs
  },
  mutations: {
    SET_AGGREGATE_BONDED_ADDED (state, transaction) {
      if (!state.aggregateBondedAdded.find(t => transaction.transactionInfo.hash === t.transactionInfo.hash)) {
        const d = state.aggregateBondedAdded
        d.unshift(transaction)
        state.aggregateBondedAdded = d
      }
    },
    SET_AGGREGATE_BONDED_REMOVED (state, transaction) {
      if (!state.aggregateBondedRemoved.find(t => transaction.transactionInfo.hash === t.transactionInfo.hash)) {
        const d = state.aggregateBondedRemoved
        d.unshift(transaction)
        state.aggregateBondedRemoved = d
      }
    },
    SET_BLOCK_INFO (state, blockInfo) {
      if (!state.blockInfo.find(t => blockInfo.hash === t.hash)) {
        const d = state.blockInfo
        d.unshift(blockInfo)
        state.blockInfo = d
      }
    },
    SET_COSIGNATURE_ADDED (state, transaction) {
      if (!state.cosignatureAdded.find(t => transaction.transactionInfo.hash === t.transactionInfo.hash)) {
        const d = state.cosignatureAdded
        d.unshift(transaction)
        state.cosignatureAdded = d
      }
    },
    SET_CONFIRMED (state, transaction) {
      console.log('transaction', transaction)
      if (!state.confirmed.find(t => transaction.transactionInfo.hash === t.transactionInfo.hash)) {
        const d = state.confirmed
        d.unshift(transaction)
        state.confirmed = d
      }
    },
    SET_UNCONFIRMED_ADDED (state, transaction) {
      if (!state.unconfirmedAdded.find(t => transaction.transactionInfo.hash === t.transactionInfo.hash)) {
        const d = state.unconfirmedAdded
        d.unshift(transaction)
        state.unconfirmedAdded = d
      }
    },
    SET_UNCONFIRMED_REMOVED (state, hash) {
      if (!state.unconfirmedRemoved.find(h => hash === h)) {
        const d = state.unconfirmedRemoved
        d.unshift(hash)
        state.unconfirmedRemoved = d
      }
    },
    SET_STATUS (state, hash) {
      if (!state.status.find(t => hash === t)) {
        const d = state.status
        d.unshift(hash)
        state.status = d
      }
    },
    SET_MONITOR_HASH (state, data) {
      const filtered = state.monitorHashs.filter(x => x.hash !== data.hash)
      filtered.push(data)
      state.monitorHashs = filtered
    },
    REMOVE_AGGREGATE_BONDED_ADDED_TX (state, hash) {
      state.aggregateBondedAdded = state.aggregateBondedAdded.filter(t => hash !== t.transactionInfo.hash)
    },
    REMOVE_AGGREGATE_BONDED_REMOVED_TX (state, hash) {
      state.aggregateBondedRemoved = state.aggregateBondedRemoved.filter(t => hash !== t.transactionInfo.hash)
    },
    REMOVE_COSIGNATURE_ADDED_TX (state, hash) {
      state.cosignatureAdded = state.cosignatureAdded.filter(t => hash !== t.transactionInfo.hash)
    },
    REMOVE_CONFIRMED_TX (state, hash) {
      state.confirmed = state.confirmed.filter(t => hash !== t.transactionInfo.hash)
    },
    REMOVE_UNCONFIRMED_ADDED_TX (state, hash) {
      state.unconfirmedAdded = state.unconfirmedAdded.filter(t => hash !== t.transactionInfo.hash)
    },
    REMOVE_UNCONFIRMED_REMOVED_TX (state, hash) {
      state.unconfirmedRemoved = state.unconfirmedRemoved.filter(t => hash !== t.transactionInfo.hash)
    },
    REMOVE_STATUS_TX (state, hash) {
      state.status = state.status.filter(t => hash !== t)
    },
    REMOVE_ALL_TXN (state) {
      state.aggregateBondedAdded = []
      state.aggregateBondedRemoved = []
      state.blockInfo = []
      state.cosignatureAdded = []
      state.confirmed = []
      state.unconfirmedAdded = []
      state.unconfirmedRemoved = []
      state.status = []
    },
    REMOVE_MONITOR_HASH (state, hash) {
      console.log('REMOVE', hash)
      const filtered = state.monitorHashs.filter(x => x.hash !== hash)
      state.monitorHashs = filtered
    }
  },
  actions: {}
}
