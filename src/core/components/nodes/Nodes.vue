<template>
  <div>
    <v-container class="mt-8" fluid>
      <v-row>
        <v-col cols="12" class="mx-auto">
          <title-subtitle :title="'Node selected'" subtitle="Current connection"></title-subtitle>
        </v-col>
      </v-row>

      <!-- NODE INFO -->
      <node-info v-if="showComponents.nodeInfo" />

      <v-row class="grey lighten-3 mt-7 pb-6">
        <v-col cols="12" class="mx-auto">
          <title-subtitle :title="'Nodes available'" />
        </v-col>

        <!-- Add Public Keys -->
        <v-col cols="12">
          <nodes-list :nodeInfo="environment.connectionNodes" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showComponents: {
        addPublicKeys: false,
        addNewNodes: true,
        nodesList: true,
        nodeInfo: true,
        nodeStatus: true
      }
    }
  },
  components: {
    'nodes-list': () => import('@/core/components/nodes/ListNodes'),
    'title-subtitle': () => import('@/core/components/shared/Title'),
    'node-info': () => import('@/core/components/nodes/NodeInfo')
  },
  computed: {
    ...mapGetters(['environment'])
  }
}
</script>
