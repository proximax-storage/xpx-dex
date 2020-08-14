import Vue from 'vue'
import AppVue from '@/App.vue'
import '@/assets/css/style.css'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
/*
import {
  GeneralService
} from './services/general'
import {
  BlockchainProvider
} from './services/blockchain-provider'
import {
  StorageService
} from './services/storage' */
// import { DataBaseProvider } from './services/dataBase-provider'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueClipboard from 'vue-clipboard2'
import VueLodash from 'vue-lodash'
import VueSocketIO from 'vue-socket.io'
import money from 'v-money'

// ---------------------- REFACTOR --------------------------------
import * as browserStorage from '@/core/utils/browserStorage'
import * as configForm from '@/core/utils/configForm'
import * as blockchain from '@/core/utils/blockchainProvider'
import * as websocketProvider from '@/core/utils/websocketProvider'
import * as general from '@/core/utils/general'
import * as filters from '@/filters'
import * as directives from '@/directives'
import * as appConfig from '@/core/appConfig'

Vue.use(VueAxios, axios)
// General Config Modules
const modulesConfig = {}
Object.keys(appConfig).forEach(element => {
  modulesConfig[element] = appConfig[element]
})

// Define Prototype
Vue.prototype.$modulesConfig = modulesConfig
Vue.prototype.$blockchainProvider = blockchain
Vue.prototype.$websocketProvider = websocketProvider
Vue.prototype.$generalService = general
Vue.prototype.$browserStorage = browserStorage
Vue.prototype.$configForm = configForm

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// register global utility directives.
Object.keys(directives).forEach(key => {
  Vue.directive(key, {
    bind: directives[key],
    update: directives[key]
  })
})

axios.get('../config/config.json').then(response => {
  store.commit('ADD_CONFIG_APP', response.data)
  store.commit('ADD_ENVIRONMENT_APP', response.data.networkSelected)
})
// ---------------------- FIN REFACTOR ----------------------

Vue.config.productionTip = false
// Vue.use(axios)
const options = {
  name: 'lodash'
} // customize the way you want to call it
Vue.use(VueClipboard)
Vue.use(VueLodash, options)
Vue.use(money)
Vue.use(
  new VueSocketIO({
    debug: false,
    connection: 'http://ec2-18-228-137-248.sa-east-1.compute.amazonaws.com:900',
    // connection: 'http://localhost:900',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    },
    options: {
      path: '',
      transports: ['websocket']
    },
    transports: ['websocket']
  })
)
/*
Vue.filter('toCurrency', function (value) {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  })
  return formatter.format(value)
}) */

// Define prototype
// Vue.prototype.$generalService = new GeneralService()
// Vue.prototype.$storage = new StorageService(localStorage)
const configIntegration = async function () {
  try {
    /* const configInfo = await axios.get('../config/config.json')
    store.commit('ADD_CONFIG_INFO', configInfo.data)
    const environment = getEnvironment(configInfo.data)
    Vue.prototype.$configInfo = configInfo
    Vue.prototype.$environment = environment
    Vue.prototype.$blockchainProvider = new BlockchainProvider(
      environment.connectionNodes.nodes[0],
      environment.connectionNodes.protocol,
      environment.connectionNodes.networkType,
      environment.coingecko
    ) */
    // Vue.prototype.$dataBaseProvider = new DataBaseProvider(
    //   environment.dataBase.host,
    //   environment.dataBase.port
    // )
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(AppVue)
    }).$mount('#app')
  } catch {
  }
}
/*
const getEnvironment = function (configInfo) {
  let environment = null
  switch (configInfo.version) {
    case 'TEST_NET':
      environment = configInfo.environment.TESTNET
      break
    case 'MAIN_NET':
      environment = configInfo.environment.MAINNET
      break
    case 'PRIVATE':
      environment = configInfo.environment.PRIVATE
      break
  }
  return environment
} */

configIntegration()
