<template>
  <v-col cols="10" class="mx-auto">
    <v-row>
      <!-- Blockchain Nodes -->
      <v-col cols="12" sm="12">
        <v-row>
          <v-col cols="12" class="headline font-weight-regular text-left primary--text">
            Nodes Blockchain
          </v-col>

          <!-- Server -->
          <v-col cols="8" md="8" class="mx-auto pt-10">
            <div class="d-flex flex-wrap align-center">
              <v-icon size="40" :color="serverStatus" :title="statusNode">mdi-server</v-icon>
              <div class="d-flex flex-column pl-2">
                <div>
                  <span class="text-caption">{{ filterCurrentNodeBlockchain.domainIp }}</span>
                </div>
                <div class="d-flex text-caption">
                  <div class="mr-auto">
                    <span class="subtitle-2 font-weight-black">Status:</span>
                    {{ statusNode }}
                  </div>
                  <div class="text-caption" v-if="currentNode">
                    <span class="pl-4 subtitle-2 font-weight-black">Height:</span>
                    {{ currentHeight }}
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-4 pb-4 pl-12 pr-12">
              <hr class="mb-1" />
            </div>
          </v-col>
          <!-- ********************** TEST ************************* -->
          <v-col cols="8" md="8" class="mx-auto pt-2">
            <ul>
              <!-- {{nodesList}} -->
              <li v-for="(items, key) of nodesList" :key="key" class="cursor-p">
                <span class="cursor-p" @click="reconnect(items)">{{ items }}</span>
                <!-- <span class="cursor-p" @click="deleteNodes(item.node)" v-if="item.type_node === 2">
                  <b>- (x)</b>
                </span> -->
              </li>
            </ul>
          </v-col>
          <v-col cols="12" md="11" class="mx-auto pt-2">
            <!-- <v-row class="d-flex align-center">
              <v-col xs="8" sm="8" md="6" lg="8" xl="8">
                <v-text-field
                  :disabled="searching"
                  v-model="nodeForm.node"
                  placeholder="Agregar nodo"
                ></v-text-field>
              </v-col>

              <v-col xs="4" sm="4" md="6" lg="4" xl="4">
                <v-btn @click="addNode()" :disabled="searching">AGREGAR NODO</v-btn>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col class="mt-1 d-flex justify-center mx-auto" cols="8">
                <v-btn class="ma-2" @click="stopConnection()">STOP</v-btn>
                <v-btn class="ma-2" @click="reconnect()">RECONNECT</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { TypeStatusNode } from 'tsjs-sirius-suite-wallet-library/dist/model/nodes/blockchain/Websocket'
import { Utilities } from 'tsjs-sirius-suite-wallet-library/dist/utils/Utilities'
import { NodeService } from '@/services/blockchain/node-service'
import Messages from '@/services/messages'

export default {
  data: () => ({
    // nodeForm: {
    //   node: '',
    //   description: 'Una breve descripción',
    //   identificationType: 2
    // },
    statusNode: Messages.nodes.success.statusNode.offline
    // searching: false
  }),
  methods: {
    ...mapMutations('nodesStoreNew', ['ADD_NODES']),
    // addNode () {
    //   if (this.nodeForm.node !== '') {
    //     this.searching = true
    //     if (!NodeService.objApiConnection) NodeService.initObjApiConnection()
    //     NodeService.objApiConnection
    //       .getBlockchainHeight(this.nodeForm.node)
    //       .then(() => {
    //         const n = Object.assign({}, this.nodeForm)
    //         this.ADD_NODES({ n: [n], toServer: true })
    //         this.nodeForm.node = ''
    //         this.searching = false
    //       })
    //       .catch((error) => {
    //         console.log('NODE ERROR', error)
    //         this.searching = false
    //       })
    //   }
    // },
    changeStatusNode (statusNode) {
      this.statusNode = statusNode
    },
    reconnect (node = this.currentNode) {
      NodeService.connect(node)
    },
    // deleteNodes (node) {
    //   NodeService.deleteNodes(node)
    // },
    stopConnection () {
      NodeService.closeConnection()
    }
  },
  computed: {
    ...mapGetters('nodesStoreNew', ['nodeStatus', 'nodesList', 'currentNode', 'currentHeight']),
    serverStatus () {
      switch (this.nodeStatus) {
        case TypeStatusNode.NODE_OFF:
          this.changeStatusNode(Messages.nodes.success.statusNode.offline)
          return 'error'
        case TypeStatusNode.NODE_CONNECTING:
          this.changeStatusNode(Messages.nodes.success.statusNode.connecting)
          return 'warning'
        case TypeStatusNode.NODE_ACTIVE:
          this.changeStatusNode(Messages.nodes.success.statusNode.online)
          return 'green'
        default:
          return 'error'
      }
    },
    splitURLs (item) {
      const split = Utilities.splitURL(item)
      return split.domainIp
    },
    filterCurrentNodeBlockchain () {
      const split = Utilities.splitURL(this.currentNode || '')
      return split
    }
  }
}
</script>
