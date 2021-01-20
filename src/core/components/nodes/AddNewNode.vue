<template>
  <div>
    <!-- ADD NODE -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="nodeField"
          dense
          counter
          outlined
          rounded
          label="Add nodes"
          type="text"
          placeholder="Example: 127.0.0.1"
        ></v-text-field>
        <custom-buttons @action="addNode" :buttons="addNodeBtn" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      buttonAddNode: {
        addNode: this.$utils.buildButton('addNode', false, 'primary', false, 'Add Node')
      },
      nodeField: '',
      nodeInfo: {
        protocol: 'http',
        protocolWs: 'ws',
        nodes: ['bctestnet1.brimstone.xpxsirius.io', 'bctestnet2.brimstone.xpxsirius.io', 'bctestnet3.brimstone.xpxsirius.io']
      }
    }
  },
  components: {
    'custom-buttons': () => import('@/core/components/shared/Buttons')
  },
  methods: {
    addNode () {
      this.nodeInfo.nodes.push(this.nodeField)
      this.nodeField = ''
    }
  },
  computed: {
    addNodeBtn () {
      const buttons = this.buttonAddNode
      buttons.addNode.disabled = this.nodeField === ''
      return buttons
    }
  }
}
</script>
