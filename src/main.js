import Vue from 'vue'
import AppVue from '@/App.vue'
import '@/assets/css/style.css'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
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

axios.get('../config/config.json', {
  headers:
  {
    'Cache-Control': 'no-cache'
  }
}).then(response => {
  store.commit('ADD_CONFIG_APP', response.data)
  store.commit('ADD_ENVIRONMENT_APP', response.data.networkSelected)
})
// ---------------------- FIN REFACTOR ----------------------
Vue.use(
  new VueSocketIO({
    debug: false,
    // connection: 'http://ec2-18-230-77-77.sa-east-1.compute.amazonaws.com:900',
    connection: 'http://18.230.157.11:900',
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
Vue.config.productionTip = false
const options = {
  name: 'lodash'
} // customize the way you want to call it
Vue.use(VueClipboard)
Vue.use(VueLodash, options)
Vue.use(money)
const configIntegration = async function () {
  try {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(AppVue)
    }).$mount('#app')
  } catch {
  }
}
configIntegration()
