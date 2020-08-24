export const onLineStore = {
  namespaced: true,
  state: {
    connected: window.navigator.onLine
  },
  getters: {
    connected: state => state.connected
  },
  mutations: {
    'SET_CONNECTED' (state, payload) {
      state.connected = payload
    }
  },
  actions: {
    setConnected ({ commit }, payload) {
      console.log('SET_CONNECTED', payload)
      commit('SET_CONNECTED', payload)
    }
  }
}
