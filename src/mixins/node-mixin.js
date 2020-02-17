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
      console.log('initNode')
      if (this.getAllNodes() === null) {
        this.setArrayNode([])
      }
      const constSelectedStorage = this.getNodeSelected()
      console.log('listNodes', this.listNodes)
      console.log('constSelectedStorage', constSelectedStorage)
      const nodeSelected =
        constSelectedStorage === null ||
        constSelectedStorage === '' ||
        constSelectedStorage.length === 0
          ? this.listNodes[Math.floor(Math.random() * this.listNodes.length)]
          : constSelectedStorage
      console.log('nodeSelected', nodeSelected)
      this.setSelectedNodeStorage(nodeSelected)
    },
    getAllNodes () {
      return JSON.parse(localStorage.getItem(this.$environment.keyLocalStore.nodeStorage))
    },
    getNodeSelected () {
      return JSON.parse(localStorage.getItem(this.$environment.keyLocalStore.nodeStorage))
    },
    setArrayNode (nodes) {
      localStorage.setItem(this.$environment.keyLocalStore.nodeStorage, JSON.stringify(nodes))
    },
    setSelectedNodeStorage (node) {
      this.$store.commit('nodeStore/SET_NODE_SELECT', node)
      localStorage.setItem(this.$environment.keyLocalStore.nodeStorage, JSON.stringify(node))
    }
  }
}
