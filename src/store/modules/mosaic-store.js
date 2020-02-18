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
    mosaics: state => state.mosaics
  },
  mutations: {
    SET_MOSAICS (state, data) {
      state.mosaics = data
    }
  }
}
