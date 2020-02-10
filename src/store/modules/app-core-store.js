export const appCoreStore = {
  namespaced: true,
  state: {
    drawer: null,
    color: null,
    image:
      'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg'
  },
  getters: {
    drawer: state => state.drawer,
    color: state => state.color
  },
  mutations: {
    SET_DRAWER (state, data) {
      state.drawer = data
    },
    SET_COLOR (state, data) {
      console.log('COLORRRRR', data)
      state.color = data
    }
  }
}
