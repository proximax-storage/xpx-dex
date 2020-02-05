import Vue from 'vue'
import Vuex from 'vuex'
import { accountStore } from './modules/account-store'
import { walletStore } from './modules/wallet-store'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    configInfo: null,
    showMenu: true,
    overlay: false,
    snackbar: {
      color: '',
      mode: '',
      snackbar: false,
      text: '',
      timeout: 5000,
      x: 'center',
      y: 'top'
    }
  },
  mutations: {
    ADD_CONFIG_INFO (state, data) {
      state.configInfo = data
    },
    SHOW_LOADING (state, value) {
      state.overlay = value
    },
    SHOW_MENU (state, value) {
      state.showMenu = value
    }
  },
  actions: {},
  modules: {
    accountStore,
    walletStore
  }
})
