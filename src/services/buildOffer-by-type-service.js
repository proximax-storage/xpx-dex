import Vue from 'vue'
import store from '@/store'
// import store from '@/store'
/**
 * Build exchange offert type add
 * @param {*} idHex
 * @param {*} mosaicAmount
 * @param {*} priceForAmount
 * @param {*} type
 * @param {*} duration
 */
function buildAddExchangeOffer (mosaicIdHex, mosaicAmount, priceForAmount, type, duration) {
  const action = 'insertMoisaicsInfo'
  const mosaicId = Vue.prototype.$blockchainProvider.getMosaicId(mosaicIdHex)
  const durationsend = Vue.prototype.$generalService.calculateDurationforDay(Number(duration))
    .toString()
  const transaction = Vue.prototype.$blockchainProvider.addExchangeOffer(
    mosaicId,
    mosaicAmount,
    priceForAmount,
    type,
    parseFloat(durationsend)
  )
  console.log('mosaicDefaultGetValidate', mosaicDefaultGetValidate(mosaicId.toHex()))
  const actionF = (mosaicDefaultGetValidate(mosaicId.toHex())) ? 'default' : 'add'
  const dataRequired = {
    moisaicsInfo: [
      {
        action: actionF,
        mosaicId: mosaicId,
        mosaicIdHex: mosaicIdHex
      }
    ],
    dataOffer: {
      type: type,
      mosaicIdHex: mosaicIdHex
    }
  }
  return {
    transaction,
    dataRequired,
    action
  }
}
/**
 *  Build exchange offert type take
 * @param {*} mosaicId
 * @param {*} mosaicAmount
 * @param {*} priceForAmount
 * @param {*} type
 * @param {*} owner
 */
function buildExchangeOffer (mosaicId, mosaicAmount, priceForAmount, type, owner) {
  const action = 'insertExecuteOffers'
  const transaction = Vue.prototype.$blockchainProvider.exchangeOffer(
    mosaicId,
    mosaicAmount,
    priceForAmount,
    type,
    owner
  )
  const transactionDb = Vue.prototype.$blockchainProvider.exchangeOfferDb(
    mosaicId,
    mosaicAmount,
    priceForAmount,
    type,
    owner
  )
  console.log('mosaicDefaultGetValidate', mosaicDefaultGetValidate(mosaicId.toHex()))
  const actionF = (mosaicDefaultGetValidate(mosaicId.toHex())) ? 'default' : 'execute'
  transactionDb.mosaicIdHex = mosaicId.toHex()
  const dataRequired = {
    dataRequiredDb: transactionDb,
    dataRequiredMosaic: {
      moisaicsInfo: [
        {
          action: actionF,
          mosaicId: mosaicId,
          mosaicIdHex: mosaicId.toHex()
        }
      ],
      dataOffer: {
        type: type,
        mosaicIdHex: mosaicId.toHex()
      }
    }
  }
  return {
    transaction,
    dataRequired,
    action
  }
}
function mosaicDefaultGetValidate (mosaicIdHex) {
  console.log('mosaicIdHex', mosaicIdHex)
  console.log('mosaicDefaultGets', store.getters.environment.mosaicDefaultGet)
  const mosaicDefaultGet = store.getters.environment.mosaicDefaultGet
  const mosaicFind = mosaicDefaultGet.find(x => x.id === mosaicIdHex)
  return Boolean(mosaicFind)
}
export {
  buildAddExchangeOffer,
  buildExchangeOffer,
  mosaicDefaultGetValidate
}
