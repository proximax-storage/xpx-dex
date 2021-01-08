import {
  getAccountsInfo
} from '@/services/account-wallet-service'
import {
  mapGetters, mapMutations
} from 'vuex'
import { Utilities } from 'tsjs-sirius-suite-wallet-library/dist/utils/Utilities'
export default {
  data () {
    return {
      connectionStablished: false
    }
  },
  computed: {
    // ...mapGetters('nodeStore', ['nodeStatus', 'networkType']),
    ...mapMutations('nodesStoreNew', ['RECONNECT']),
    ...mapGetters('nodesStoreNew', ['nodeStatus', 'currentNode', 'reconnect']),
    ...mapGetters('transactionsStore', ['confirmed', 'status', 'unconfirmedAdded'])
  },
  watch: {
    nodeStatus (newValue) {
      // console.log('\n------------ STATUS NODE HAS CHANGED  ------------\n')
      // Init app
      if (newValue === 2) {
        const uri = Utilities.splitURL(this.currentNode)
        this.$blockchainProvider.instanceConnectionApi(uri.domainIp, uri.protocol)
        this.connectionStablished = true
        const allAccounts = this.$store.getters['walletStore/currentWallet'].accounts
        getAccountsInfo(allAccounts)
        if (!this.reconnect) {
          this.$store.dispatch('socketDbStore/getMoisaicsInfo', {
            io: this.$socket,
            data: null
          })
        }
      }
    },
    confirmed (transactions) {
      const allAccounts = this.$store.getters['walletStore/currentWallet'].accounts
      getAccountsInfo(allAccounts)
      // console.log('----- WATCH CONFIRMED ------', transactions)
      const hashs = transactions.map(t => t.transactionInfo.hash)
      const monitorHashs = this.$store.getters['transactionsStore/getMonitorHashs']
      monitorHashs.forEach(element => {
        if (hashs.find(x => x === element.hash)) {
          // console.log('MONITOR HASH FOUND --->', element)
          this.REMOVE_MONITOR_HASH(element.hash)
          this.actions(element)
        }
      })
    },
    status (hashs) {
      // console.log('----- WATCH STATUS ------', hashs)
      const monitorHashs = this.$store.getters['transactionsStore/getMonitorHashs']
      monitorHashs.forEach(element => {
        if (hashs.find(x => x === element.hash)) {
          this.REMOVE_MONITOR_HASH(element.hash)
          this.REMOVE_STATUS_TX(element.hash)
        }
      })
    }
    // unconfirmedAdded (transactions) {
    //   const hashs = transactions.map(t => t.transactionInfo.hash)
    //   const monitorHashs = this.$store.getters['transactionsStore/getMonitorHashs']
    //   monitorHashs.forEach(element => {
    //     if (hashs.find(x => x === element.hash)) {
    //       this.REMOVE_MONITOR_HASH(element.hash)
    //       this.actions(element)
    //     }
    //   })
    // },

  },
  methods: {
    ...mapMutations('transactionsStore', ['REMOVE_STATUS_TX', 'REMOVE_MONITOR_HASH']),
    actions (data) {
      switch (data.action) {
        case 'insertMoisaicsInfo':
          // console.log('I N S E R T    MOSAIC INFO ', JSON.stringify(data.dataRequired.moisaicsInfo))
          this.$store.dispatch('socketDbStore/insertMoisaicsInfo', {
            io: this.$socket,
            data: data.dataRequired
          })
          break
        case 'insertExecuteOffers':
          // console.log('I N S E R T    EXECUE ', JSON.stringify(data.dataRequired.dataRequiredDb))
          this.$store.dispatch('socketDbStore/insertExecuteOffers', {
            io: this.$socket,
            data: data.dataRequired.dataRequiredDb
          })
          this.$store.dispatch('socketDbStore/insertMoisaicsInfo', {
            io: this.$socket,
            data: data.dataRequired.dataRequiredMosaic
          })
          break
        case 'removeExchangeOffer':
          // this.$store.dispatch('socketDbStore/removeExchangeOffer', {
          //   io: this.$socket,
          //   data: data.dataRequired.dataRequiredDb
          // })
          this.$store.dispatch('socketDbStore/insertMoisaicsInfo', {
            io: this.$socket,
            data: data.dataRequired.dataRequiredMosaic
          })
          break
      }
    }
  },
  created () {
    window.addEventListener('offline', () => {
      this.$store.dispatch('onLineStore/setConnected', false)
    })
    window.addEventListener('online', () => {
      this.$store.dispatch('onLineStore/setConnected', true)
    })
  }
}
