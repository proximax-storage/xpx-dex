<template>
  <v-content :style="backgroundImage" style="background-size:100% 100%;">
    <!-- <div :style="backgroundImage"> -->
      <v-fade-transition mode="out-in" transition="slide-x-transition">
        <router-view />
      </v-fade-transition>
    <!-- </div> -->
    <!-- <core-footer v-if="$route.name !== 'Maps'" /> -->
  </v-content>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      backgroundId: 'bg.jpg',
      img: null
    }
  },
  computed: {
    ...mapGetters('accountStore', ['isLogged']),
    backgroundImage () {
      let img = null
      if (!this.isLogged) {
        img = `background-image: url(${require(`@/assets/img/bg.jpg`)})`
        // img = null
      }
      return img
    }
  }
}
</script>
<style >
</style>
