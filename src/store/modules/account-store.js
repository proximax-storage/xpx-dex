export const accountStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    accountsInfo: null,
    currentAccount: null,
    balanceCurrentAccount: null,
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
    totalBalance: state => idFilter => {
      let amountTotal = 0.0
      if (state.accountsInfo && state.accountsInfo.length > 0) {
        for (const element of state.accountsInfo) {
          if (element && element.accountInfo) {
            if (element.accountInfo.mosaics && element.accountInfo.mosaics.length > 0) {
              const mosaicXpx = element.accountInfo.mosaics.find(
                mosaic => mosaic.id.toHex() === idFilter
              )
              if (mosaicXpx) {
                amountTotal = amountTotal + mosaicXpx.amount.compact()
              }
            }
          }
        }
      }
      return amountTotal
    },
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
    SET_BALANCE_CURRENT_ACCOUNT (state, data) {
      console.log('SET_BALANCE_CURRENT_ACCOUNT', data)
      state.balanceCurrentAccount = data
    },
    SET_CURRENT_ACCOUNT (state, data) {
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
