export const walletStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    currentWallet: null,
    wallets: []
  },
  getters: {
    currentWallet: state => state.currentWallet,
    nameCurrentWallet: state => state.currentWallet.username,
    wallets: state => state.wallets
    // someGetter (state, getters, rootState, rootGetters) {
    //   console.log
    //   let wallets = null
    //   if (rootGetters.pseudonymApp) {
    //     wallets = this._vm.$browserStorage.get(`${rootGetters.environment.keyLocalStore.key}-wallets-${rootGetters.pseudonymApp}`)
    //     if (!wallets) {
    //       this._vm.$browserStorage.set(`${rootGetters.environment.keyLocalStore.key}-wallets-${rootGetters.pseudonymApp}`, [])
    //       return []
    //     }
    //     return JSON.parse(wallets)
    //   }
    //   return []
    // }
    // walletsStorage: status =>
  },
  mutations: {
    SET_CURRENT_WALLET (state, data) {
      state.currentWallet = data
    },
    SET_NAME_CURRENT_WALLET (state, data) {
      state.currentWallet.username = data
    },
    SET_WALLETS (state, data) {
      state.wallets = data
    }
  },
  actions: {
    GET_WALLETS ({ commit, dispatch, rootGetters }, data) {
      console.log('rootGetters')
    }

  }
}
