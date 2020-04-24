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
import { mapState } from 'vuex'
import getInfoAssetsMixin from '@/mixins/get-info-assets-mixin'
import monitorNodesTxn from '@/mixins/monitor-nodes-txn-mixin'
export default {
  mixins: [getInfoAssetsMixin, monitorNodesTxn],
  name: 'App',
  data: () => ({
  }),
  components: {
    'menu-item': () => import('@/components/Menu')
  },
  computed: {
    ...mapState(['overlay', 'snackbar']),
    ...mapState(['showMenu'])
  }
}
</script>
