import Vue from 'vue'
import store from '@/store'
/**
 *
 * @param {*} items
 */
function getAllOffer (items) {
  console.log(' items getAllOffer', items)
  const pass = []
  const x = items.filter(x => x.data.length > 0)
  if (x.length > 0) {
    x.forEach(element => {
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

export {
  getAllOffer,
  filtersAssetsFunc
}
