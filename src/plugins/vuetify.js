import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    options: {
      customProperties: true,
      minifyTheme: function (css) {
        return process.env.NODE_ENV === 'production' ? css.replace(/[\r\n|\r|\n]/g, '') : css
      }
    },
    themes: {
      light: {
        primary: '#0CFF5D',
        secondary: '#FFB80C',
        light: '#49B3FF',
        leve: '#FFFFFF',
        dim: '#333333',
        darkness: '#222222',
        chip1: '#194b2e',
        chip2: '#4a3c19',
        chip3: '#102638'
      },
      dark: {
        primary: '#0CFF5D',
        secondary: '#FFB80C',
        light: '#49B3FF',
        leve: '#FFFFFF',
        dim: '#333333',
        darkness: '#222222',
        chip1: '#194b2e',
        chip2: '#4a3c19',
        chip3: '#102638'
      }
    }
  }
})
