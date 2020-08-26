import { base64IconFromAggregateTx } from '@/services/icon-mosaic-service'
export const mosaicStore = {
  namespaced: true,
  state: {
    mosaics: [],
    metadata: null,
    iconMosaic: [
    ],
    mosaicDescription: [
    ]

    // mosaics: [
    //   {
    //     idMosaic: null,
    //     isNamespace: null,
    //     mosaicInfo: null,
    //     mosaicNames: null
    //   }
    // ]
  },
  mutations: {
    SET_MOSAICS (state, data) {
      // console.log('SET_MOSAICS', data)
      state.mosaics = data
    },
    SET_MOSAIC_ICON (state, data) {
      // console.log('SET_MOSAICS', data)
      state.iconMosaic = data
    },
    PUSH_MOSAIC_ICON (state, data) {
      if (state.iconMosaic.length > 0) {
        const findMosaicIcon = state.iconMosaic.find(x => x.mosaicId.toHex() === data.mosaicId.toHex())
        if (findMosaicIcon) {
          for (var i in state.iconMosaic) {
            if (state.iconMosaic[i].mosaicId.toHex() === data.mosaicId.toHex()) {
              state.iconMosaic[i].iconBase64 = data.iconBase64
              break // Stop this loop, we found it!
            }
          }
        } else {
          state.iconMosaic.push(data)
        }
      } else {
        state.iconMosaic.push(data)
      }
    },
    PUSH_MOSAICS_DESCRIPTION (state, data) {
      if (state.mosaicDescription.length > 0) {
        const mosaicDescription = state.mosaicDescription.find(x => x.mosaicId.toHex() === data.mosaicId.toHex())
        if (mosaicDescription) {
          for (var i in state.mosaicDescription) {
            if (state.mosaicDescription[i].mosaicId.toHex() === data.mosaicId.toHex()) {
              state.mosaicDescription[i].description = data.description
              break // Stop this loop, we found it!
            }
          }
        } else {
          state.mosaicDescription.push(data)
        }
      } else {
        state.mosaicDescription.push(data)
      }
    },
    SET_METADATA (state, data) {
      state.metadata = data
    }

  },
  getters: {
    mosaics: state => {
      return state.mosaics
    },
    iconMosaic: state => {
      return state.iconMosaic
    },
    mosaicDescription: state => {
      return state.mosaicDescription
    },
    othersMosaics: state => idFilter => {
      let othersMosaics = []
      if (state.mosaics && state.mosaics.length > 0) {
        othersMosaics = state.mosaics.filter(item => item.mosaicInfo.mosaicId.toHex() !== idFilter)
      }
      return othersMosaics
    }
  },
  actions: {
    GET_MOSAICS_METADATA ({ commit, dispatch }, data) {
      (async () => {
        for (let x of data) {
          try {
            const metadata = await this._vm.$blockchainProvider.getMosaicMetadata(x).toPromise()
            commit('SET_METADATA', metadata)
            dispatch('GET_MOSAICS_ICON', metadata)
            dispatch('GET_MOSAICS_DESCRIPTION', metadata)
          } catch {
            // console.error('Not metadata mosaic')
          }
        }
      })()
    },
    async GET_MOSAICS_ICON ({ commit }, data) {
      const fliterFields = data.fields.find(x => x.key === 'icon')
      if (fliterFields) {
        if (fliterFields.value.length === 64) {
          const tx = await this._vm.$blockchainProvider.getTransactionId(fliterFields.value).toPromise()
          if (tx.type === this._vm.$blockchainProvider.typeTransactions().aggregateComplete.id) {
            commit('PUSH_MOSAIC_ICON', { iconBase64: base64IconFromAggregateTx(tx), mosaicId: data.metadataId })
          }
        }
      }
    },
    async GET_MOSAICS_DESCRIPTION ({ commit }, data) {
      const fliterFields = data.fields.find(x => x.key === 'desc')
      if (fliterFields) {
        commit('PUSH_MOSAICS_DESCRIPTION', { description: fliterFields.value, mosaicId: data.metadataId })
      }
    }

  }
}
