import Vue from 'vue'
import App from './App.vue'
import './assets/css/style.css'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { GeneralService } from './services/general'
import { BlockchainProvider } from './services/blockchain-provider'
import { StorageService } from './services/storage'
import axios from 'axios'
Vue.config.productionTip = false
// Vue.use(axios)

// Define prototype
Vue.prototype.$generalService = new GeneralService()
Vue.prototype.$storage = new StorageService(localStorage)
const configIntegration = async function () {
  try {
    const configInfo = await axios.get('../config/config.json')
    console.log('configInfo', configInfo)
    store.commit('ADD_CONFIG_INFO', configInfo.data)
    const environment = getEnvironment(configInfo.data)
    Vue.prototype.$configInfo = configInfo
    Vue.prototype.$environment = environment
    Vue.prototype.$blockchainProvider = new BlockchainProvider(
      environment.connectionNodes.nodes[0],
      environment.connectionNodes.protocol,
      environment.connectionNodes.networkType
    )
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  } catch (e) {
    console.error(e)
  }
}
const getEnvironment = function (configInfo) {
  let environment = null
  switch (configInfo.version) {
    case 'PUBLIC_TEST':
      environment = configInfo.environment.PUBLICTEST
      break
    case 'MAIN_NET':
      environment = configInfo.environment.MAINNET
      break
  }
  return environment
}

configIntegration()
