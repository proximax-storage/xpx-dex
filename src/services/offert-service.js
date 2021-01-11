import Vue from 'vue'
import store from '@/store'
import {
  TransactionType
} from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/TransactionType'

/**
 *
 * @param {*} data
 * @param {*} mosaicUpdate
 */
function getAllOffer (data, mosaicUpdate = null) {
  let allOffers = {
    sell: [],
    buy: []
  }
  let priceBuy = []
  let priceSell = []
  const sell = data.items.itemBuy
  const buy = data.items.itemSell
  priceBuy = (buy) ? buy.data.map(x => x.price) : []
  priceSell = (sell) ? sell.data.map(x => x.price) : []
  if (buy) {
    allOffers.buy = buy.data
  }
  if (sell) {
    allOffers.sell = sell.data
  }
  const priceArray = priceBuy.concat(priceSell)
  const price = calAverage(priceArray, data.info.mosaicInfo[0].mosaicInfo.properties.divisibility)
  const pas = {
    tableData: {
      graphic: [],
      text: data.info.text,
      type: 'sell',
      averagePrice: price,
      info: data.info,
      priceArray: priceArray,
      twentyFourChange: {
        percentChange: 0,
        act: null
      }
    },
    allOffers: allOffers
  }
  const pass = store.getters['offersStore/offerAll']
  if (!pass.find(x => x.tableData.text === data.info.text)) {
    // console.debug('PUSH')
    store.commit('offersStore/PUSH_OFFER_ALL', pas)
  } else {
    // console.debug('UPDATE')
    store.commit('offersStore/UPDATE_OFFER_ALL', pas)
  }
  store.commit('offersStore/UPDATE_OFFER_BOOLEAN')
  store.dispatch('socketDbStore/getOffertTxFromIdHexMosaic',
    {
      io: Vue.prototype.$socket,
      data: {
        mosaicIdHex: data.info.mosaicIdHex,
        minutesFilter: 720
      }
    })

  // this.$store.dispatch('socketDbStore/getMoisaicsInfo', {
  //   io: this.$socket,
  //   data: null
  // })
}

function graphicChange (offers) {
  const data = {
    mosaicIdHex: null,
    valueGraphic: []
  }
  data.mosaicIdHex = offers[0].mosaicIdHex
  data.valueGraphic = offers.map(x => int64compact(x.cost) / int64compact(x.mosaicAmount))
  store.commit('offersStore/UPDATE_OFFER_GRAPHIC_CHANGE', data)
}
/**
 *
 * @param {*} offers
 */
function twentyFourChange (offers) {
  const data = {
    mosaicIdHex: null,
    percentChange: 0,
    act: null
  }
  if (offers.length > 1) {
    // Order by
    const offerOrder = Vue.prototype.$generalService.sortByKey(offers, 'timestamp')
    // Calc range date
    const firstOffer = offerOrder[0]
    const lastOffer = offerOrder[offerOrder.length - 1]
    const startTime = new Date(firstOffer.timestamp)
    const endTime = new Date(lastOffer.timestamp)
    const difference = endTime.getTime() - startTime.getTime() // This will give difference in milliseconds
    const resultInMinutes = Math.round(difference / 60000)
    if (resultInMinutes >= 720) {
      const firstOfferCost = int64compact(firstOffer.cost)
      const firstOfferAmount = int64compact(firstOffer.mosaicAmount)
      const firstOfferPrice = firstOfferCost / firstOfferAmount
      const lastOfferCost = int64compact(lastOffer.cost)
      const lastOfferAmount = int64compact(lastOffer.mosaicAmount)
      const lastOfferPrice = lastOfferCost / lastOfferAmount
      const diff = firstOfferPrice - lastOfferPrice
      const percent = diff / firstOfferPrice
      data.mosaicIdHex = firstOffer.mosaicIdHex
      data.percentChange = Math.abs(percent * 100)
      data.act = (percent <= 0) ? 'positive' : 'negative'
    }
  }
  store.commit('offersStore/UPDATE_OFFER_TWENTY_FOUR_CHANGE', data)
  // return data
}
function int64compact (value) {
  return Vue.prototype.$blockchainProvider.getUint64([
    value['lower'],
    value['higher']
  ]).compact()
}

/**
 *
 * @param {*} data
 * @param {*} divisibility
 */
function calAverage (data, divisibility = 1) {
  let total = 0
  const amount = Vue.prototype.$generalService.addZerosQuantity(divisibility, 1)
  data.forEach(element => {
    const priceUni = amount * element
    total = total + priceUni
  })
  return Vue.prototype.$generalService.amountFormatter(total / data.length)
}

/**
 *
 * @param {*} data
 */
function filtersAssetsFunc (data) {
  let valor = []
  if (JSON.parse(JSON.stringify(data)).length > 0) {
    valor = data.map(item => {
      item.text = item.mosaicIdHex
      if (
        item.mosaicInfo !== null &&
        item.mosaicInfo !== undefined &&
        item.mosaicInfo[0] &&
        item.mosaicInfo[0].mosaicNames.names.length > 0
      ) {
        item.text = item.mosaicInfo[0].mosaicNames.names[0].name
      }
      return item
    })
  }
  return valor
}
/**
 *
 * @param {*} data
 */
function filterAssets (data) {
  if (data) {
    data.text = data.mosaicIdHex
    if (
      data.mosaicInfo !== null &&
      data.mosaicInfo !== undefined &&
      data.mosaicInfo[0] &&
      data.mosaicInfo[0].mosaicNames.names.length > 0
    ) {
      data.text = data.mosaicInfo[0].mosaicNames.names[0].name
    }
    return data
  }
}
/**
 *
 * @param {*} data
 */
async function validateExpireOffer (data, typeOffer) {
  try {
    const tx = await Vue.prototype.$blockchainProvider.getOutgoingTransactions(data.owner).toPromise()
    const txFilter = filterTxOfferForType(TransactionType.ADD_EXCHANGE_OFFER, tx)
    const pushTx = filterTxOffer(txFilter, data, typeOffer)
    const block = store.getters['nodesStoreNew/currentHeight']
    const offer = findOffer(pushTx, data, typeOffer)
    const blockHeight = pushTx[0].transactionInfo.height.compact()
    let dataRet = null
    for (let index = 0; index < offer.length; index++) {
      const element = offer[index]
      const rest = block - blockHeight
      const expireIn = element.duration.compact() - rest
      if (rest >= element.duration.compact()) {
        dataRet = { expire: true, infoExpire: 0 }
        break
      } else {
        dataRet = { expire: false, infoExpire: { expireInitial: expireIn, blockHeight: blockHeight, duration: element.duration.compact() } }
      }
    }
    return dataRet
  } catch {
  }
  return true
}
/**
 *
 * @param {*} type
 */
function filterTxOfferForType (type, tx = []) {
  const txs = tx.filter(x => x.type === type)
  return txs
}
/**
 *
 * @param {*} tx
 * @param {*} txCompare
 */
function filterTxOffer (tx, txCompare, typeOffer) {
  let pushTx = []
  for (let x of tx) {
    let offertTx = x.offers.filter(l =>
      l.mosaicId.toHex() === txCompare.mosaicId.toHex() &&
      l.cost.compact() === txCompare.initialCost.compact() &&
      l.mosaicAmount.compact() === txCompare.initialAmount.compact() &&
      l.type === typeOffer)
    if (offertTx.length > 0) {
      pushTx.push(x)
    }
  }
  return pushTx
}
/**
 * TODO
 * @param {*} tx
 * @param {*} txCompare
 */
function findOffer (tx, txCompare, typeOffer) {
  let pushOffer = []
  // reduce((a, b) => Math.max(a, b))
  for (let x of tx) {
    let offertTx = x.offers.find(l =>
      l.mosaicId.toHex() === txCompare.mosaicId.toHex() &&
      l.cost.compact() === txCompare.initialCost.compact() &&
      l.mosaicAmount.compact() === txCompare.initialAmount.compact() &&
      l.type === typeOffer)
    if (offertTx) {
      pushOffer.push(offertTx)
    }
  }
  return pushOffer
}
function update (mosaicInfoDb) {
  console.log('-------------------mosaicInfodb', mosaicInfoDb)
  store.dispatch('socketDbStore/UPDATE_MOSAICS_INFO', mosaicInfoDb)
}
export {
  getAllOffer,
  filtersAssetsFunc,
  filterAssets,
  validateExpireOffer,
  update,
  twentyFourChange,
  graphicChange

}
