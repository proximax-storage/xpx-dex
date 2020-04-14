<template>
  <v-content :style="backgroundImage">
    <!-- <div :style="{ backgroundImage: `url(${ require(`@/assets/img/${backgroundId}`)})`}"> -->
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
      backgroundId: 'bg-proximax-zoom-test.jpg',
      img: null
    }
  },
  computed: {
    ...mapGetters('accountStore', ['isLogged']),
    backgroundImage () {
      let img = null
      if (!this.isLogged) {
        // img = `background-image: url("/img/bg-proximax-zoom-test.c81b1ad7.jpg")`
        img = null
      }
      return img
    }
  }
}
</script>
<style >
</style>
