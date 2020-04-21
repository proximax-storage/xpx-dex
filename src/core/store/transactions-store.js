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
    incomingTransactions: [],
    outgoingTransactions: [],
    unconfirmedAdded: [],
    unconfirmedRemoved: [],
    status: []
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
    status: state => state.status
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
    SET_UNCONFIRMED_REMOVED (state, transaction) {
      if (!state.unconfirmedRemoved.find(t => transaction.transactionInfo.hash === t.transactionInfo.hash)) {
        const d = state.unconfirmedRemoved
        d.unshift(transaction)
        state.unconfirmedRemoved = d
      }
    },
    SET_STATUS (state, transaction) {
      if (!state.status.find(t => transaction.transactionInfo.hash === t.transactionInfo.hash)) {
        const d = state.status
        d.unshift(transaction)
        state.status = d
      }
    }
  },
  actions: {}
}
