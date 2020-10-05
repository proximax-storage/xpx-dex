<template>
  <div>
    <!-- NODES LIST -->
    <progress-linear :showProgressLinear="stateTestBtn" />

    <v-row>
      <v-col cols="12" class="pt- text-center">
        <template v-for="(item, key) of nodeInfo.nodes">
          <div :key="key" class="d-flex justify-center pa-1">
            <v-btn
              x-small
              text
              :disabled="stateTestBtn"
              @click="testNode(item)"
            >
              <v-icon color="primary" class="mr-2" v-if="currentNode && currentNode.uri === item">mdi-checkbox-blank-circle</v-icon>
              <v-icon class="mr-2" v-else>mdi-checkbox-blank-circle-outline</v-icon>
              <span class="subtitle-1 text-transform-none">{{item}}</span>
            </v-btn>
          </div>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProgressLinear from '@/core/components/shared/ProgressLinear'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['nodeInfo'],
  data () {
    return {
      testing: false,
      nodeSelected: ''
    }
  },
  components: {
    'progress-linear': ProgressLinear
  },
  computed: {
    ...mapGetters('nodeStore', ['nodeStatus', 'currentNode']),
    stateTestBtn () {
      if (this.nodeStatus !== 2 || this.nodeStatus === '') return false
      return true
    }
  },
  methods: {
    ...mapActions('nodeStore', ['initNodes']),
    testNode (node) {
      this.testing = true
      this.nodeInfo.uriSelected = node
      console.log('inicializo el nodo')
      this.initNodes(this.nodeInfo)
    }
  }
}
</script>
