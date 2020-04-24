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
    ...mapGetters('transactionsStore', ['confirmed', 'status', 'unconfirmedAdded'])
  },
  watch: {
    confirmed (transactions) {
      console.log('----- WATCH CONFIRMED ------', transactions)
      const hashs = transactions.map(t => t.transactionInfo.hash)
      const monitorHashs = this.$store.getters['transactionsStore/getMonitorHashs']
      monitorHashs.forEach(element => {
        if (hashs.find(x => x === element.hash)) {
          console.log('MONITOR HASH FOUND --->', element)
          this.REMOVE_MONITOR_HASH(element.hash)
          this.actions(element)
        }
      })
    },
    status (hashs) {
      console.log('----- WATCH STATUS ------', hashs)
      const monitorHashs = this.$store.getters['transactionsStore/getMonitorHashs']
      monitorHashs.forEach(element => {
        if (hashs.find(x => x === element.hash)) {
          this.REMOVE_MONITOR_HASH(element.hash)
          this.REMOVE_STATUS_TX(element.hash)
        }
      })
    },
    unconfirmedAdded (transactions) {
      console.log('----- WATCH UNCONFIRMED_ADDED ------', transactions)
      const hashs = transactions.map(t => t.transactionInfo.hash)
      const monitorHashs = this.$store.getters['transactionsStore/getMonitorHashs']
      monitorHashs.forEach(element => {
        if (hashs.find(x => x === element.hash)) {
          console.log('MONITOR HASH FOUND --->', element)
          this.REMOVE_MONITOR_HASH(element.hash)
          this.actions(element)
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
    ...mapMutations('transactionsStore', ['REMOVE_STATUS_TX', 'REMOVE_MONITOR_HASH']),
    actions (data) {
      console.log('INIT ACTION ---->', data)
      switch (data.action) {
        case 'insertMoisaicsInfo':
          this.$store.dispatch('socketDbStore/insertMoisaicsInfo', {
            io: this.$socket,
            data: data.dataRequired
          })
          break
      }
    }
  }
}
