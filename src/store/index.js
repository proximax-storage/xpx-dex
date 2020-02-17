import Vue from 'vue'
import Vuex from 'vuex'
import { accountStore } from './modules/account-store'
import { walletStore } from './modules/wallet-store'
import { appCoreStore } from './modules/app-core-store'
import { namespaceStore } from './modules/namespace-store'
import { nodeStore } from './modules/node-store'
import { mosaicStore } from './modules/mosaic-store'
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
    },
    SHOW_SNACKBAR (state, data) {
      const { snackbar, text, color } = data
      state.snackbar.snackbar = snackbar
      state.snackbar.text = text
      state.snackbar.color = color
    }
  },
  actions: {
    showMSG ({ commit }, data) {
      commit('SHOW_SNACKBAR', data)
    }
  },
  modules: {
    accountStore,
    walletStore,
    appCoreStore,
    nodeStore,
    namespaceStore,
    mosaicStore
  }
})
