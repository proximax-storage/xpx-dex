export const offersStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    offerSelected: []
  },
  getters: {
    offerSelected: state => state.offerSelected
  },
  mutations: {
    SET_OFFER_SELECTED (state, data) {
      state.offerSelected = data
    }
  }
}
