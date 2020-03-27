export default {
  data: () => {
    return {
      listNodes: null
    }
  },
  beforeMount () {
    this.listNodes = this.$environment.connectionNodes.nodes
  },
  methods: {
    initNode () {
      if (this.getAllNodes() === null) {
        this.setArrayNode([])
      }
      const constSelectedStorage = this.getNodeSelected()
      const nodeSelected =
        constSelectedStorage === null ||
        constSelectedStorage === '' ||
        constSelectedStorage.length === 0
          ? this.listNodes[Math.floor(Math.random() * this.listNodes.length)]
          : constSelectedStorage
      this.setSelectedNodeStorage(nodeSelected)
    },
    getAllNodes () {
      return JSON.parse(localStorage.getItem(this.$environment.keyLocalStore.nodeStorage))
    },
    getNodeSelected () {
      return JSON.parse(localStorage.getItem(this.$environment.keyLocalStore.selectedNode))
    },
    setArrayNode (nodes) {
      localStorage.setItem(this.$environment.keyLocalStore.nodeStorage, JSON.stringify(nodes))
    },
    setSelectedNodeStorage (node) {
      this.$store.commit('nodeStore/SET_NODE_SELECT', node)
      localStorage.setItem(this.$environment.keyLocalStore.selectedNode, JSON.stringify(node))
    }
  }
}
