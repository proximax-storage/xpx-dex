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
  getters: {
    mosaics: state => state.mosaics,
    othersMosaics: state => idFilter => {
      console.log('idFilter', idFilter)
      let othersMosaics = []
      if (state.mosaics && state.mosaics.length > 0) {
        othersMosaics = state.mosaics.filter(item => item.mosaicInfo.mosaicId.toHex() !== idFilter)
      }
      console.log('othersMosaics', othersMosaics)
      return othersMosaics
    }
  },
  mutations: {
    SET_MOSAICS (state, data) {
      state.mosaics = data
    }
  }
}
