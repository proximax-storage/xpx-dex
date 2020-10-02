import Vue from 'vue'
import store from '@/store'
import {
  TransactionType
} from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/TransactionType'

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
  console.log('data', data)
  const pas = {
    tableData: {
      text: data.info.text,
      type: 'sell',
      averagePrice: price,
      info: data.info,
      priceArray: priceArray,
      twentyFourChange: `${(
        (Math.floor(Math.random() * 20) + Math.floor(Math.random() * 1000)) /
        100
      ).toFixed(2)}`
    },
    allOffers: allOffers
  }
  const pass = store.getters['offersStore/offerAll']
  if (!pass.find(x => x.tableData.text === data.info.text)) {
    console.debug('PUSH')
    store.commit('offersStore/PUSH_OFFER_ALL', pas)
  } else {
    console.debug('UPDATE')
    store.commit('offersStore/UPDATE_OFFER_ALL', pas)
  }
}
function calAverage (data, divisibility = 1) {
  let total = 0
  const amount = Vue.prototype.$generalService.addZerosQuantity(divisibility, 1)
  data.forEach(element => {
    const priceUni = amount * element
    total = total + priceUni
  })
  return Vue.prototype.$generalService.amountFormatter(total / data.length)
}
// function removeOffer (offer, mosaicFilterUpEvent) {
//   const dataValue = validateDeleteOffer(offer)
//   dataValue.forEach(x => {
//     if (x.deleteV) {
//       store.commit('offersStore/DELETE_OFFER_ALL', x.mosaicIdHex)
//     }
//   })
// }
// function validateDeleteOffer (oferts) {
//   let newArray = []
//   let arrayTemporal = []
//   for (var i = 0; i < oferts.length; i++) {
//     arrayTemporal = newArray.filter(resp => resp['mosaicIdHex'] === oferts[i]['info']['mosaicIdHex'])
//     if (arrayTemporal.length > 0) {
//       newArray[newArray.indexOf(arrayTemporal[0])]['validateDelete'].push(oferts[i]['type'])
//     } else {
//       newArray.push({
//         'mosaicIdHex': oferts[i]['info']['mosaicIdHex'],
//         'validateDelete': [oferts[i]['type']]
//       })
//     }
//   }
//   return newArray.map(x => {
//     return {
//       mosaicIdHex: x.mosaicIdHex,
//       deleteV: Boolean(x.validateDelete.length === 2)
//     }
//   })
// }

/**
 *
 * @param {*} data
 */
// function sumAllAmount (data) {
//   let total = 0
//   data.forEach(element => {
//     total = total + element
//   })

//   return total
// }
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
    const block = store.getters['nodeStore/currentBlock']
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
function update (mosaicInfodb) {
  store.dispatch('socketDbStore/UPDATE_MOSAICS_INFO', mosaicInfodb)
}
export {
  getAllOffer,
  filtersAssetsFunc,
  filterAssets,
  validateExpireOffer,
  update

}
