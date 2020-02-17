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
      console.log('SET_MOSAICS', data)
      state.mosaics = data
    }
  }
}
