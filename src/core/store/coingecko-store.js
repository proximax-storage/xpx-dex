export const coingeckoStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    xpxInformation: null,
    typeCurrency: [{
      label: 'USD',
      value: 'usd'
    },
    {
      label: 'BTC',
      value: 'btc'
    },
    {
      label: 'ETH',
      value: 'eth'
    }
    ]
  },
  getters: {
    typeCurrency: state => state.typeCurrency,
    xpxInformation: state => state.xpxInformation,
    xpxToOtherCurrency: state => fiatCurrency => {
      return (state.xpxInformation) ? state.xpxInformation.market_data.current_price[fiatCurrency] : '0.00'
    },
    convertToOtherCurrency: (state, getters) => (balance, fiatCurrency) => {
      let balanceConverted = ''
      const toOtherCurrency = getters.xpxToOtherCurrency(fiatCurrency)
      if (toOtherCurrency) balanceConverted = Number(balance.replace(/,/g, '')) * toOtherCurrency
      return balanceConverted
    }
  },
  mutations: {
    SET_XPX_INFORMATION (state, xpxInformation) {
      state.xpxInformation = xpxInformation
    }
  },
  actions: {
    searchInformationXPX ({
      commit,
      rootGetters
    }) {
      const url = rootGetters.environment.coingecko.url
      const coinToSearch = 'proximax'
      this._vm.$http.get(`${url}${coinToSearch}`).then(x => {
        commit('SET_XPX_INFORMATION', x.data)
      }, () => {
      })
    }
  }
}
