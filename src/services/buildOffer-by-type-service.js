import Vue from 'vue'
// import store from '@/store'

function buildAddExchangeOffer (idHex, mosaicAmount, priceForAmount, type, duration) {
  console.log('PASE POR AQUI ====================>')
  const action = 'insertMoisaicsInfo'
  const id = Vue.prototype.$blockchainProvider.getMosaicId(idHex)
  const durationsend = Vue.prototype.$generalService.calculateDurationforDay(Number(duration))
    .toString()
  const transaction = Vue.prototype.$blockchainProvider.addExchangeOffer(
    id,
    mosaicAmount,
    priceForAmount,
    type,
    parseFloat(durationsend)
  )

  const dataRequired = {
    moisaicsInfo: [
      {
        mosaicId: id,
        mosaicIdHex: idHex
      }
    ],
    dataOffer: {
      type: type,
      mosaicIdHex: idHex
    }
  }
  return {
    transaction,
    dataRequired,
    action
  }
}

export {
  buildAddExchangeOffer
}
