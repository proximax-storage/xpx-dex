
import store from '@/store'
import Msg from '@/services/messages'
export class WebsocketService {
  static subscription = []
  /**
   *
   *
   * @static
   * @memberof TransactionService
   */
  static destroySubscriptions () {
    if (this.subscription && this.subscription.length > 0) this.subscription.forEach(x => x.unsubscribe())
    this.subscription = []
  }

  /**
  *
  *
  * @static
  * @param {WebsocketConnection} obj
  * @memberof TransactionService
  */
  static subscribeAggregateBondedAdded (obj) {
    this.subscription.push(obj.aggregateBondedAdded.subscribe(aggregateTransaction => {
      // if (aggregateTransaction) store.commit('transactionsStore/AGREGATE_BONDED_ADDED', [aggregateTransaction])
    }))
  }

  /**
   *
   *
   * @static
   * @param {WebsocketConnection} obj
   * @memberof TransactionService
   */
  static subscribeAggregateBondedRemoved (obj) {
    this.subscription.push(obj.aggregateBondedRemoved.subscribe(hash => {
      // if (hash) store.commit('transactionsStore/AGREGATE_BONDED_ADDED', [hash])
    }))
  }

  /**
   *
   *
   * @static
   * @param {WebsocketConnection} obj
   * @memberof TransactionService
   */
  static subscribeBlockInfo (obj) {
    this.subscription.push(obj.newBlock.subscribe(blockInfo => {
      if (blockInfo) store.commit('nodesStoreNew/SET_CURRENT_HEIGHT', blockInfo.height.compact())
    }))
  }

  /**
   *
   *
   * @static
   * @param {WebsocketConnection} obj
   * @memberof TransactionService
   */
  static subscribeCosignatureAdded (obj) {
    this.subscription.push(obj.cosignatureAdded.subscribe(cosignatureSignedTransaction => {
      // if (cosignatureSignedTransaction) store.commit('transactionsStore/COSIGNATURE_ADDED', cosignatureSignedTransaction)
    }))
  }

  /**
   *
   *
   * @static
   * @param {WebsocketConnection} obj
   * @memberof TransactionService
   */
  static subscribeConfirmed (obj) {
    this.subscription.push(obj.confirmed.subscribe(transaction => {
      if (transaction) {
        WebsocketService.showMsgAndChangeStatus(Msg.ws.confirmed, 'success')
        store.commit('transactionsStore/SET_CONFIRMED', transaction)
      }
    }))
  }

  /**
   *
   *
   * @static
   * @param {WebsocketConnection} obj
   * @memberof TransactionService
   */
  static subscribeUnconfirmedAdded (obj) {
    // console.log(Msg.ws)
    this.subscription.push(obj.unconfirmedAdded.subscribe(transaction => {
      if (transaction) {
        WebsocketService.showMsgAndChangeStatus(Msg.ws.unconfirmed, 'success')
        store.commit('transactionsStore/SET_UNCONFIRMED_ADDED', transaction)
      }
    }))
  }

  /**
   *
   *
   * @static
   * @param {WebsocketConnection} obj
   * @memberof TransactionService
   */
  static subscribeUnconfirmedRemoved (obj) {
    this.subscription.push(obj.unconfirmedRemoved.subscribe(hash => {
      // if (hash) store.commit('transactionsStore/UNCONFIRMED_REMOVED', hash)
    }))
  }

  /**
   *
   *
   * @static
   * @param {WebsocketConnection} obj
   * @memberof TransactionService
   */
  static subscribeStatus (obj) {
    this.subscription.push(obj.status.subscribe(transaction => {
      // console.log('transaction', transaction)
      if (transaction) {
        WebsocketService.showMsgAndChangeStatus(transaction.status.split('_').join(' '), 'errorIntense')
        store.commit('transactionsStore/SET_STATUS', transaction.hash)
      }
    }))
  }
  /**
 *
 *
 * @param {*} msg
 * @param {*} status
 * @param {*} color
 */
  static showMsgAndChangeStatus (msg, color, status = null) {
    // if (status !== null) store.commit('nodeStore/SET_STATUS_NODE', status)
    store.commit('SHOW_SNACKBAR', {
      snackbar: true,
      text: msg,
      color: color
    })
  }

  /**
   *
   *
   * @static
   * @param {WebsocketConnection} obj
   * @memberof TransactionService
   */
  static subscribeAllChannels (obj) {
    this.destroySubscriptions()
    this.subscribeAggregateBondedAdded(obj)
    this.subscribeAggregateBondedRemoved(obj)
    this.subscribeBlockInfo(obj)
    this.subscribeCosignatureAdded(obj)
    this.subscribeConfirmed(obj)
    this.subscribeUnconfirmedAdded(obj)
    this.subscribeUnconfirmedRemoved(obj)
    this.subscribeStatus(obj)
  }
}
