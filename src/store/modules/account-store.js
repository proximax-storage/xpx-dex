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
    isLogged: false,
    mosaicBuild: []
  },
  getters: {
    accountsInfo: state => state.accountsInfo,
    mosaicBuild: state => state.mosaicBuild,
    accountInfoByNameAccount: state => nameAccount => {
      if (state.accountsInfo && state.accountsInfo.length > 0) {
        return state.accountsInfo.find(next => next.name === nameAccount)
      } else {
        return null
      }
    },
    accountInfoByAdress: state => byAddress => {
      if (state.accountsInfo && state.accountsInfo.length > 0) {
        if (byAddress) {
          let found = null
          state.accountsInfo.forEach(element => {
            if (element.accountInfo) {
              if (element.accountInfo.address.pretty() === byAddress) {
                found = element
              }
            }
          })

          // return this.accountsInfo.find(next => (next.accountInfo) ? next.accountInfo.address.pretty() === account : []);
          return found
        }
      }
    },
    userData: state => state.dataUser,
    isLogged: state => state.isLogged,
    currentAccount: state => state.currentAccount,
    balanceCurrentAccount: state => state.balanceCurrentAccount,
    balanceAccount: state => state.balanceAccount,
    totalBalance: state => idFilter => {
      let amountTotal = 0.0
      if (state.accountsInfo && state.accountsInfo.length > 0) {
        for (const element of state.accountsInfo) {
          if (element && element.accountInfo) {
            if (element.accountInfo.mosaics && element.accountInfo.mosaics.length > 0) {
              const mosaics = element.accountInfo.mosaics.find(
                mosaic => mosaic.id.toHex() === idFilter
              )
              if (mosaics) {
                amountTotal = amountTotal + mosaics.amount.compact()
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
      // console.log('SET_INFO_ACCOUNT', data)
      state.accountsInfo = data
    },
    SET_BALANCE_CURRENT_ACCOUNT (state, data) {
      // console.log('SET_BALANCE_CURRENT_ACCOUNT', data)
      state.balanceCurrentAccount = data
    },
    SET_CURRENT_ACCOUNT (state, data) {
      state.currentAccount = data
    },
    SET_TOTAL_BALANCE (state, data) {
      // console.log('SET_TOTAL_BALANCE', data)
      state.totalBalance = data
    },
    UPDATE_DATA_USER (state, data) {
      state.dataUser = data
    },
    CHANGE_NAME_USER (state, name) {
      state.dataUser.name = name
    },
    SET_BUILD_CURRENT_ACCOUNT_MOSAIC (state, data) {
      // console.log('\n\n SET_BUILD_CURRENT_ACCOUNT_MOSAIC \n', data)
      state.mosaicBuild = data
    }
  },
  actions: {
    LOGOUT ({ commit }, data) {
      commit('LOGIN', null)
    }
  }
}
