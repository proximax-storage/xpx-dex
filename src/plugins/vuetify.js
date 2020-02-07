import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    options: {
      customProperties: true,
      minifyTheme: function (css) {
        return process.env.NODE_ENV === 'production' ? css.replace(/[\r\n|\r|\n]/g, '') : css
      }
    },
    themes: {
      light: {
        primary: '#E9E9E9',
        secondary: '#00bcd4',
        accent: '#03a9f4',
        error: '#f44336',
        warning: '#ffc107',
        info: '#2196f3',
        success: '#4caf50',
        darkness: '#222222', // CUMSTON
        pin: 'D08C07',
        dim: '#00B938',
        sky: '007DB9',
        leve: '#E9E9E9',
        leveint: 'DDDDDD'
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
