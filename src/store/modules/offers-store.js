// import { twentyFourChange } from '@/services/offert-service'
import { filterAssets, getAllOffer } from '@/services/offert-service'
export const offersStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    offerSelected: [],
    offerAll: [],
    type: ['buy', 'sell'],
    allOfferGet: []
  },
  getters: {
    offerSelected: state => state.offerSelected,
    offerAll: state => state.offerAll,
    offersForPublicKey: state => state.offersForPublicKey,
    type: state => state.type
  },
  mutations: {
    SET_OFFER_SELECTED (state, data) {
      state.offerSelected = data
    },
    SET_OFFER_ALL (state, data) {
      state.offerAll = data
    },
    PUSH_OFFER_ALL (state, data) {
      // const push = twentyFourChange()
      state.offerAll.push(data)
    },
    UPDATE_OFFER_ALL (state, data) {
      for (var i = 0; i < state.offerAll.length; i++) {
        if (state.offerAll[i].tableData.info.mosaicIdHex === data.tableData.info.mosaicIdHex) {
          state.offerAll[i].allOffers = data.allOffers
          state.offerAll[i].tableData = data.tableData
          break
        }
      }
      // console.log('state.offerAll', JSON.stringify(state.offerAll))
    },
    DELETE_OFFER_ALL (state, idMosaic) {
      for (var i = 0; i < state.offerAll.length; i++) {
        if (state.offerAll[i].tableData.info.mosaicIdHex === idMosaic) {
          state.offerAll.splice(i, 1)
          break
        }
      }
    }
  },
  actions: {
    GET_EXCHANGE_OFFER ({ commit, dispatch }, data) {
      (async () => {
        const mosaic = filterAssets(data)
        const offerBuy = await this._vm.$blockchainProvider.getExchangeOffersfromId(mosaic.mosaicIdHex, 0).toPromise()
        const offerSell = await this._vm.$blockchainProvider.getExchangeOffersfromId(mosaic.mosaicIdHex, 1).toPromise()
        const itemBuy = {
          type: 'buy',
          data: offerBuy
        }
        const itemSell = {
          type: 'sell',
          data: offerSell
        }
        if (itemSell.data.length > 0 || itemBuy.data.length > 0) {
          getAllOffer({ items: { itemBuy, itemSell }, info: data })
        } else {
          commit('DELETE_OFFER_ALL', mosaic.mosaicIdHex)
        }
      })()
    }
  }
}
