import Vue from 'vue'
import store from '@/store'
import {
  TransactionType
} from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/TransactionType'
/**
 *
 * @param {*} items
 */
function getAllOffer (items) {
  const pass = []
  const x = items.filter(x => x.data.length > 0)
  Object.freeze(x)
  if (x.length > 0) {
    x.forEach(element => {
      // console.log('element.info.mosaicInfo', element.info.mosaicInfo)
      if (element.info.mosaicInfo) {
        const price = sumAllAmount(element.data.map(x => x.price)) / element.data.length
        const amount = sumAllAmount(element.data.map(x => x.amount.compact()))
        const totalAssets = Vue.prototype.$generalService.amountFormatter(
          amount,
          element.info.mosaicInfo[0].mosaicInfo.properties.divisibility
        )
        const offersBuy = items.filter(
          x => x.info.mosaicIdHex === element.info.mosaicIdHex && x.type === 'buy'
        )
        const offersSell = items.filter(
          x => x.info.mosaicIdHex === element.info.mosaicIdHex && x.type === 'sell'
        )

        if (!pass.find(x => x.tableData.text === element.info.text)) {
          pass.push({
            tableData: {
              text: element.info.text,
              type: element.type,
              totalAssetAvailable: totalAssets,
              averagePrice: price,
              info: element.info,
              priceArray: element.data.map(x => x.price),
              twentyFourChange: `${(
                (Math.floor(Math.random() * 20) + Math.floor(Math.random() * 1000)) /
                100
              ).toFixed(2)}`
            },
            allOffers: {
              sell: offersSell.length > 0 ? offersSell[0].data : offersSell,
              buy: offersBuy.length > 0 ? offersBuy[0].data : offersBuy
            }
          })
        }
      }
    })
  }
  store.commit('offersStore/SET_OFFER_ALL', pass)
  return pass
}
/**
 *
 * @param {*} data
 */
function sumAllAmount (data) {
  let total = 0
  data.forEach(element => {
    total = total + element
  })

  return total
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
async function validateExpireOffer (data, typeOffer) {
  console.log('dataaasss', data)
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
  } catch (error) {
    console.error('----Search namespaces from accoun ts error----', error)
  }
  console.log('offer::ssss', data)
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
export {
  getAllOffer,
  filtersAssetsFunc,
  validateExpireOffer

}
