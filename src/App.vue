<template>
  <v-app>
    <!-- Menu -->
    <!-- <menu-item v-if="showMenu"></menu-item> -->

    <!-- Overlay -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!-- Message -->
    <v-snackbar
      v-model="snackbar.snackbar"
      :bottom="snackbar.y === 'bottom'"
      :top="snackbar.y === 'top'"
      :right="snackbar.x === 'right'"
      :left="snackbar.x === 'left'"
      :vertical="snackbar.mode === 'vertical'"
      :color="snackbar.color"
      :multi-line="snackbar.mode === 'multi-line'"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <v-btn dark text @click="snackbar.snackbar = false">Close</v-btn>
    </v-snackbar>
    <menu-item></menu-item>
  </v-app>
</template>

<script>
import { getAccountsInfo } from '@/services/account-wallet-service'
// import getInfoAssetsMixin from './mixins/get-info-assets-mixin'
import { mapState, mapGetters } from 'vuex'
export default {
  // mixins: [getInfoAssetsMixin],
  name: 'App',
  data: () => ({
    connectionStablished: false
  }),
  components: {
    'menu-item': () => import('@/components/Menu')
  },
  computed: {
    ...mapState(['overlay', 'snackbar']),
    ...mapState(['showMenu']),
    ...mapGetters('nodeStore', ['nodeStatus'])
  },
  watch: {
    nodeStatus (newValue, oldValue) {
      console.log('Node status has changed \n\n', newValue)
      // Node status is active
      if (newValue === 1 && !this.connectionStablished) {
        this.connectionStablished = true
        getAccountsInfo(this.$store.getters['walletStore/currentWallet'].accounts)
      }
    }
  },
  mounted () {
    // this.$store.dispatch('socketDbStore/getMoisaicsInfo', { io: this.$socket, data: null })
  }
}
</script>
