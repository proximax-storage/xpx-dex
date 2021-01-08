import store from '@/store'
import {
  searchInfoMosaics
} from '@/services/mosaics-service'
import {
  update,
  twentyFourChange,
  graphicChange
} from '@/services/offert-service'
export const socketDbStore = {
  namespaced: true,
  state: {
    offersTx: [],
    newOffersTx: null,
    mosaicsInfOffer: [],
    loadingInfo: false,
    inserted: null,
    unchanged: null
  },
  mutations: {
    SOCKET_SET_OFFERS (state, data) {
      // console.log('SOCKET_SET_OFFERS', data)
      state.offersTx = data
    },
    SOCKET_SET_NEW_OFFERS (state, data) {
      // console.log('SET_NEW_OFFERS', data)
      state.newOffersTx = data
      state.offersTx.push(data)
    },
    SOCKET_SET_MOSAIC_INFO (state, data) {
      // console.log('SOCKET_SET_MOSAIC_INFO', data)
      // state.mosaicsInfOffer = data
      store.dispatch('socketDbStore/GET_MOSAICS_INFO', data)
    },
    EVENT_SET_MOSAIC_INFO (state, data) {
      // console.log('EVENT_SET_MOSAIC_INFO', data)
      state.mosaicsInfOffer = data
    },
    EVENT_PUSH_MOSAIC_INFO (state, data) {
      // console.log('EVENT_PUSH_MOSAIC_INFO', data)
      state.mosaicsInfOffer.push(data)
    },
    EVENT_LOADING_MOSAIC_INFO (state, data) {
      // console.log('EVENT_LOADING_MOSAIC_INFO', data)
      state.loadingInfo = data
    },
    EVENT_INSERTED (state, data) {
      state.inserted = data
    },
    EVENT_UNCHANGED (state, data) {
      state.unchanged = data
    },
    SOCKET_RETURN_INSERT_OFFERT (state, data) {
      // console.log('SOCKET_RETURN_INSERT_OFFERT', data)
    },
    SOCKET_RETURN_INSERT_EXECUTE_OFFERS (state, data) {
      // console.log('RETURN_INSERT_EXECUTE_OFFERS', data)
    },
    SOCKET_RETURN_GET_OFFERT_TX_ID_HEX (state, data) {
      twentyFourChange(data)
      graphicChange(data)
    },
    SOCKET_RETURN_INSERT_MOSAIC_INFO (state, data) {
      state.unchanged = null
      state.inserted = null
      const dataDb = data.dataDb
      console.log('SOCKET_RETURN_INSERT_MOSAIC_INFO', data)
      // changes
      if (dataDb['inserted'] > 0) {
        for (let index = 0; index < dataDb['inserted']; index++) {
          const element = dataDb['changes'][index]
          if (element['new_val']) {
            console.log('UPDATE inserted', element['new_val'])
            update(element['new_val'])
          }
        }
      } else if (dataDb['changes'].length > 0) {
        console.log('changes udapte', data.dataOffer)
        update(data.dataOffer)
        // state.unchanged = data.dataOffer
      }
    }
  },
  getters: {
    inserted: state => state.inserted,
    unchanged: state => state.unchanged,
    offersTx: state => state.offersTx,
    newOffersTx: state => state.newOffersTx,
    offers: state => {
      let offers = []
      if (state.offersTx) {
        for (let items of state.offersTx) {
          offers.push({ offer: items.offers })
        }
      }
      return offers
    },
    mosaicsInfOffer: state => state.mosaicsInfOffer,
    mosaicsInfOfferFromIdHex: state => iDhex => {
      return state.mosaicsInfOffer.filter(next => next.mosaicIdHex === iDhex)
    },
    loadingInfo: state => state.loadingInfo
  },
  actions: {
    UPDATE_MOSAICS_INFO ({ commit, dispatch, state }, data) {
      (async () => {
        const mosaicsInfOffer = state.mosaicsInfOffer.find(x => x.mosaicIdHex === data.mosaicIdHex)
        if (mosaicsInfOffer) {
          console.log('GET_EXCHANGE_OFFER 1')
          dispatch('offersStore/GET_EXCHANGE_OFFER', mosaicsInfOffer, { root: true })
        } else {
          dispatch('GET_MOSAICS_INFO', [data])
        }
      })()
    },
    GET_MOSAICS_INFO ({ commit, dispatch }, data) {
      (async () => {
        if (data.length > 0) {
          for (let item of data) {
            commit('EVENT_LOADING_MOSAIC_INFO', true)
            if (item.mosaicInfo === undefined) {
              try {
                const mosaicId = this._vm.$blockchainProvider.getMosaicId(item.mosaicIdHex)
                const mosaicInfo = await searchInfoMosaics([mosaicId], true)
                dispatch('SET_MOSAICS_INFO_FOR_OFFER', mosaicInfo)
              } catch (error) {
              }
            }
          }
        } else {
          commit('EVENT_LOADING_MOSAIC_INFO', false)
        }
      })()
    },
    SET_MOSAICS_INFO_FOR_OFFER ({ commit, dispatch, state }, data) {
      const mosaicHex = this._vm.$blockchainProvider.getMosaicId(data[0].idMosaic).toHex()
      const mosaicsInfOffer = state.mosaicsInfOffer.find(x => x.mosaicIdHex === mosaicHex)
      if (mosaicsInfOffer) {
        for (var i in state.mosaicsInfOffer) {
          if (state.mosaicsInfOffer[i].mosaicIdHex === mosaicHex) {
            state.mosaicsInfOffer[i].mosaicInfo = data
            console.log('GET_EXCHANGE_OFFER 2')
            dispatch('offersStore/GET_EXCHANGE_OFFER', state.mosaicsInfOffer[i], { root: true })
            break // Stop this loop, we found it!
          }
        }
        state.loadingInfo = false
        state.mosaicsInfOffer = JSON.parse(JSON.stringify(state.mosaicsInfOffer))
      } else {
        state.loadingInfo = false
        const mosaicsInf = { mosaicIdHex: mosaicHex, mosaicInfo: data }
        console.log('GET_EXCHANGE_OFFER 3')
        dispatch('offersStore/GET_EXCHANGE_OFFER', mosaicsInf, { root: true })
        state.mosaicsInfOffer.push(mosaicsInf)
      }
    },
    getOffertsTx: ({ commit, state }, params) => {
      params.io.emit('getOffertsTx', params.data)
    },
    getMoisaicsInfo: ({ commit, state }, params) => {
      commit('EVENT_LOADING_MOSAIC_INFO', true)
      params.io.emit('getMoisaicsInfo', params.data)
    },

    getOffertTxFromIdHexMosaic: ({ commit, state }, params) => {
      params.io.emit('getOffertTxFromIdHexMosaic', params.data)
    },
    insertNewOffers: ({ commit, state }, params) => {
      params.io.emit('insertNewOffers', params.data)
    },
    insertExecuteOffers: ({ commit, state }, params) => {
      params.io.emit('insertExecuteOffers', params.data)
    },
    insertMoisaicsInfo: ({ commit, state }, params) => {
      params.io.emit('insertMoisaicsInfo', params.data)
    },
    // app
    setMoisaicUnchanged: ({ commit, state }, params) => {
      commit('EVENT_SET_MOSAIC_INFO', params)
      // params.io.emit('insertMoisaicsInfo', params.data)
    },
    pushMosaicInfoOffer: ({ commit, state }, params) =>
      commit('EVENT_PUSH_MOSAIC_INFO', params)
  }
}
