<template>
  <v-app>
    <!-- Menu -->
    <!-- <menu-item v-if="showMenu"></menu-item> -->

    <!-- Overlay -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <menu-item></menu-item>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  data: () => ({}),
  components: {
    'menu-item': () => import('@/components/Menu')
  },
  computed: {
    ...mapState(['overlay', 'snackbar']),
    ...mapState(['showMenu'])
  }
}
</script>
<style>
/* #core-view {
  padding-bottom: 100px;
} */
</style>
