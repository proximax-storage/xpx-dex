import {
  getAccountsInfo
} from '@/services/account-wallet-service'
import {
  mapGetters, mapMutations
} from 'vuex'

export default {
  data () {
    return {
      connectionStablished: false
    }
  },
  computed: {
    ...mapGetters('nodeStore', ['nodeStatus', 'networkType']),
    ...mapGetters('transactionsStore', ['confirmed', 'status'])
  },
  watch: {
    confirmed (transactions) {
      const transactionsFiltered = this.$store.getters['monitorNodesTxnStore/filterHash'](transactions)
      console.log('transactionsFiltered', transactionsFiltered)
      transactionsFiltered.forEach(element => {
        console.log('element', element)
      })
    },
    status (hashs) {
      console.log('----- STATUS ------', hashs)
      const monitorHashs = this.$store.getters['monitorNodesTxnStore/getMonitorHashs']
      hashs.forEach(h => {
        if (monitorHashs.find(x => x.hash === h)) {
          this.REMOVE_MONITOR_HASH(h)
          this.REMOVE_STATUS_TX(h)
        }
      })
    },
    nodeStatus (newValue, oldValue) {
      console.log('\n------------ STATUS NODE HAS CHANGED ------------\n')
      // Init app
      if (newValue === 1) {
        this.connectionStablished = true
        const allAccounts = this.$store.getters['walletStore/currentWallet'].accounts
        const accountsFormatter = allAccounts.map(x => this.$blockchainProvider.publicAccountFromPublicKey(x.publicKey, this.networkType).address)
        this.$websocketProvider.monitorAllChannels(accountsFormatter)
        getAccountsInfo(allAccounts)
        this.$store.dispatch('socketDbStore/getMoisaicsInfo', {
          io: this.$socket,
          data: null
        })
      }
    }
  },
  methods: {
    ...mapMutations('monitorNodesTxnStore', ['REMOVE_MONITOR_HASH']),
    ...mapMutations('transactionsStore', ['REMOVE_STATUS_TX'])
  }
}
