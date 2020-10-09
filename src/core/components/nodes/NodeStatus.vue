<template>
  <div>
    <v-row>
      <v-col cols="6 pr-0 ">
        <!-- <template v-if="currentNode"> -->
        <div class="text-center pt-1 d-flex align-center">
          <span class="caption" :title="currentNode">
            <router-link to="/nodes">
              <template v-if="nodeStatus === serverStatus.NODE_ACTIVE">
                <img
                  :src="require(`@/assets/img/${theme}/icon-nodes-green-30h.svg`)"
                  alt
                  width="25px"
                />
              </template>
              <template v-if="nodeStatus === serverStatus.NODE_CONNECTING">
                <img
                  :src="require(`@/assets/img/${theme}/icon-nodes-yellow-30h.svg`)"
                  alt
                  width="25px"
                />
              </template>

              <template v-if="nodeStatus === serverStatus.NODE_OFF">
                <img
                  :src="require(`@/assets/img/${theme}/icon-nodes-red-30h.svg`)"
                  alt
                  width="25px"
                />
              </template>
            </router-link>
          </span>
        </div>
        <!-- </template> -->
      </v-col>
      <template v-if="nodeStatus === serverStatus.NODE_OFF">
        <v-col cols="6 pr-0">
          <div class="text-center pt-1 d-flex align-center">
            <v-btn icon small @click="reconnect()">
                  <span class="caption" title="Reconnect node">

              <v-icon>mdi-cached</v-icon>
                </span>
            </v-btn>
          </div>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { TypeStatusNode } from 'tsjs-sirius-suite-wallet-library/dist/model/nodes/blockchain/Websocket'
import { NodeService } from '@/services/blockchain/node-service'
export default {
  data () {
    return {
      serverStatus: TypeStatusNode,
      theme: 'light'
    }
  },
  computed: {
    ...mapGetters('nodesStoreNew', ['currentNode', 'nodeStatus', 'currentNode'])
    // NODE_OFF = 0,
    //   NODE_CONNECTING = 1,
    //   NODE_ACTIVE = 2,
    //   NODE_STUCK = 3,
    //   NODE_SYNCHRONIZING = 4
  },
  methods: {
    ...mapMutations('nodesStoreNew', ['RECONNECT']),
    reconnect (node = this.currentNode) {
      NodeService.connect(node)
      this.RECONNECT(true)
    }
  }
}
</script>
