export const mosaicsStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    mosaicsInfo: [],
    mosaicsName: [],
    mosaicBrowserStorage: 'sirius-suite-mosaics',
    allMosaicsInfo: []
  },
  getters: {
    mosaicsInfo: state => state.mosaicsInfo,
    mosaicsName: state => state.mosaicsName,
    allMosaicsInfo: state => state.allMosaicsInfo,
    totalAssetsFromAccount: (state, getters, rootState, rootGetters) => (publicKey) => {
      const filteredAccountInfo = rootGetters['accountWalletStore/filterAccountInfo'](publicKey)
      return (filteredAccountInfo && Object.keys(filteredAccountInfo).length > 0) ? filteredAccountInfo.accountInfo.mosaics.length : 0
    },
    mosaicsInfoFromAccount: (state, getters, rootState, rootGetters) => (publicKey) => {
      const mosaicsBuilded = []
      const accountFiltered = rootGetters['accountWalletStore/filterAccountInfo'](publicKey)
      if (accountFiltered && Object.keys(accountFiltered).length > 0) {
        accountFiltered.accountInfo.mosaics.forEach(element => {
          const mosaicInfo = getters.allMosaicsInfo.find(x => x.idHex === element.id.toHex())
          mosaicsBuilded.push({
            idMosaic: element.id.toHex(),
            isNamespace: '',
            name: '',
            mosaicInfo,
            quantity: element.amount.compact()
          })
        })
      }

      return mosaicsBuilded
    }
  },
  mutations: {
    SET_MOSAICS (state, mosaics) {
      console.log('SET_MOSAICS')
      const filtered = state.mosaicsInfo
      mosaics.forEach(element => {
        const current = state.mosaicsInfo.find(x => x.mosaicId.toHex() === element.mosaicId.toHex())
        if (!current) filtered.push(element)
      })
      console.log('SET_MOSAICS', filtered)
      state.mosaicsInfo = filtered
    },
    SET_MOSAICS_NAMES (state, mosaicsName) {
      console.log('mosaicsName', mosaicsName)
      const filtered = state.mosaicsName
      mosaicsName.forEach(element => {
        if (element && element.names.length > 0) {
          const exist = state.mosaicsName.find(x => x.names[0].name === element.names[0].name)
          if (!exist) filtered.push(element)
        }
      })

      state.mosaicsName = filtered
    }
  },
  actions: {
    SET_MOSAICS_NAMES ({
      state,
      commit,
      rootGetters
    }, data) {
      const allMosaicsName = data
      const network = this._vm.$blockchainProvider.filterNetworkTypeFromString(rootGetters.environment.connectionNodes.networkType)
      const mosaicsStorage = JSON.parse(this._vm.$giftCardService.getStorageMosaicsName(network))
      if (mosaicsStorage) {
        mosaicsStorage.forEach(element => {
          if (!allMosaicsName.find(b => b.mosaicHex === element.mosaicHex)) allMosaicsName.push(element)
        })
      }

      this._vm.$giftCardService.setStorageMosaicsName(JSON.stringify(allMosaicsName), network)
      commit('SET_MOSAICS_NAMES', allMosaicsName)
    }
  }
}
