import Vue from 'vue'
import Vuex from 'vuex'
import {
  accountStore
} from './modules/account-store'
import {
  walletStore
} from './modules/wallet-store'
import {
  appCoreStore
} from './modules/app-core-store'
import {
  namespaceStore
} from './modules/namespace-store'
// import { nodeStore } from './modules/node-store'
import {
  mosaicStore
} from './modules/mosaic-store'
import {
  socketDbStore
} from './modules/socket-db-store'
import {
  mosaicExchange
} from './modules/mosaic-exchange'
import {
  socketBcStore
} from './modules/socket-bc-store'
import {
  offersStore
} from './modules/offers-store'
import {
  nodeStore,
  transactionsStore
} from '@/core/store/'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    environment: null,
    configApp: null,
    networkSelected: '',
    count: null,
    showMenu: true,
    overlay: false,
    loadingInfoWallet: {
      show: false,
      text: '',
      type: null
    },
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
  getters: {
    nameApp: state => {
      if (state.configApp) return state.configApp.infoApp.nameApp
      else return ''
    },
    pseudonymApp: state => {
      if (state.configApp) return state.configApp.infoApp.pseudonymApp
      else return ''
    },
    version: state => {
      if (state.configApp) return state.configApp.infoApp.version
      else return ''
    },
    environment: state => state.environment
  },
  mutations: {
    ADD_CONFIG_APP (state, data) {
      state.configApp = data
      state.networkSelected = data.networkSelected
    },
    ADD_ENVIRONMENT_APP (state, networkType) {
      if (state.configApp) state.environment = state.configApp.environment[networkType]
    },
    SHOW_LOADING (state, value) {
      state.overlay = value
    },
    SHOW_MENU (state, value) {
      state.showMenu = value
    },
    SHOW_LOADING_INFO_WALLET (state, data) {
      state.loadingInfoWallet.show = data.show
      state.loadingInfoWallet.text = data.text
      state.loadingInfoWallet.type = data.type
    },
    SHOW_SNACKBAR (state, data) {
      state.snackbar.snackbar = data.snackbar
      state.snackbar.text = data.text
      state.snackbar.color = data.color
    }
  },
  actions: {
    showMSG ({
      commit
    }, data) {
      commit('SHOW_SNACKBAR', data)
    },
    showLIW ({
      commit
    }, data) {
      commit('SHOW_LOADING_INFO_WALLET', data)
    }
  },
  modules: {
    accountStore,
    walletStore,
    appCoreStore,
    nodeStore,
    transactionsStore,
    namespaceStore,
    mosaicStore,
    socketDbStore,
    mosaicExchange,
    socketBcStore,
    offersStore
  }
})
