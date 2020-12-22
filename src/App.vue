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
import { mapState, mapGetters, mapMutations } from 'vuex'
import monitorNodesTxn from '@/mixins/monitor-nodes-txn-mixin'
import { TypeStatusNode } from 'tsjs-sirius-suite-wallet-library/dist/model/nodes/blockchain/Websocket'
import { NodeService } from '@/services/blockchain/node-service'
export default {
  mixins: [monitorNodesTxn],
  name: 'App',
  data: () => ({}),
  components: {
    'menu-item': () => import('@/components/Menu')
  },
  computed: {
    ...mapState(['overlay', 'snackbar']),
    ...mapState(['showMenu']),
    ...mapGetters('nodesStoreNew', ['nodeStatus', 'stoppedByUser', 'retryConnection'])
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'SHOW_SNACKBAR']),
    ...mapMutations('nodesStoreNew', ['STOPPED_BY_USER', 'ADD_RETRY_CONNECTION'])
  },
  watch: {
    nodeStatus (newVal) {
      console.warn('new status nodes', newVal)
      if (newVal === TypeStatusNode.NODE_OFF && !this.stoppedByUser) {
        this.STOPPED_BY_USER(false)
        if (this.retryConnection < 3) {
          setTimeout(() => {
            this.ADD_RETRY_CONNECTION(this.retryConnection + 1)
            NodeService.connect()
          }, 1000)
        } else {
          this.ADD_RETRY_CONNECTION(0)
          const msg = 'Ha alcanzado el número máximo de reconexión, por favor revise su conexión a internet e intente seleccionar un nuevo nodo'
          this.SHOW_SNACKBAR({
            snackbar: true,
            text: msg,
            color: 'errorIntense',
            timeout: 8000
          })
        }
      }
    }
  }
}
</script>
