export const accountStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    accountsInfo: null,
    currentAccount: null,
    balanceAccount: null,
    totalBalance: null,
    dataUser: null,
    isLogged: false
  },
  getters: {
    accountsInfo: state => state.accountsInfo,
    userData: state => state.dataUser,
    isLogged: state => state.isLogged,
    currentAccount: state => state.currentAccount,
    balanceAccount: state => state.balanceAccount,
    totalBalance: state => state.totalBalance,
    address: state => state.dataUser.simpleWallet.address['address']
  },
  mutations: {
    LOGIN (state, data) {
      if (data && data.username && data.accounts) {
        state.isLogged = true
      } else {
        state.isLogged = false
      }
      state.dataUser = data
    },
    SET_INFO_ACCOUNT (state, data) {
      console.log('SET_INFO_ACCOUNT', data)
      state.accountsInfo = data
    },
    SET_BALANCE_ACCOUNT (state, data) {
      console.log('SET_BALANCE_ACCOUNT', data)
      state.balanceAccount = data
    },
    SET_CURRENT_ACCOUNT (state, data) {
      console.log('SET_CURRENT_ACCOUNT', data)
      state.currentAccount = data
    },
    SET_TOTAL_BALANCE (state, data) {
      state.totalBalance = data
    },
    UPDATE_DATA_USER (state, data) {
      state.dataUser = data
    },
    CHANGE_NAME_USER (state, name) {
      state.dataUser.name = name
    }
  },
  actions: {
    LOGOUT ({ commit }, data) {
      commit('LOGIN', null)
    }
  }
}
