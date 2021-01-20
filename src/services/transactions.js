import store from '@/store'
import Vue from 'vue'

export class ServiceTransactions {
  static statusTransactions () {
    const monitorHashs = store.getters['transactionsStore/getMonitorHashs']
    const hashes = monitorHashs.map(x => x.hash)
    if (hashes.length > 0) {
      Vue.prototype.$blockchainProvider.getTransactionsStatuses(hashes).subscribe(transactionStatus => {
        if (transactionStatus.length > 0) {
          transactionStatus.forEach(e => {
            if (e.status === 'Success' && (e.group === 'confirmed' || e.group === 'unconfirmed')) {
              store.commit('transactionsStore/SET_CONFIRMED_STATUS', e)
            }
          })
        }
      })
    }
  }
}
