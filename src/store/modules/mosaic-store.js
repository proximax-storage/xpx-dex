export const mosaicStore = {
  namespaced: true,
  state: {
    mosaics: []
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
      console.log('SET_MOSAICS', data)
      state.mosaics = data
    }
  },
  getters: {
    mosaics: state => {
      return state.mosaics
    },
    othersMosaics: state => idFilter => {
      // console.log('idFilter', idFilter)
      let othersMosaics = []
      if (state.mosaics && state.mosaics.length > 0) {
        othersMosaics = state.mosaics.filter(item => item.mosaicInfo.mosaicId.toHex() !== idFilter)
      }
      // console.log('othersMosaics', othersMosaics)
      return othersMosaics
    }
  },
  actions: {
    GET_ICON_MOSAICS ({ commit }, data) {
      console.log('GET_ICON_MOSAICS MSOIA', data)
    }

  }
}
