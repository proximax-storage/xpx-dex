<template>
  <v-col cols="6">
    <v-select
      class="pt-1"
      v-model="form.selectNamespace"
      :items="itemsNamespace"
      :item-disabled="itemsNamespace.disabled"
      @change="triggerClick($event)"
      item-text="namespaceName.name"
      item-value="idToHex"
      :loading="loading"
      attach
      dense
      :rules="[]"
      :color="inputStyle"
      label="Name"
    ></v-select>
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      inputStyle: 'inputStyle',
      form: {
        selectNamespace: null
      },
      rootNamespace: [
        {
          namespaceName: {
            name: 'New Root Namespace'
          },
          idToHex: null,
          type: 0,
          disabled: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters('namespaceStore', ['namespacesFromAddress', 'loading']),
    ...mapGetters('accountStore', ['currentAccount']),
    itemsNamespace () {
      return this.getNamespacesFromAddress()
    }
  },
  methods: {
    disabledNamespaceList (listNamespace) {
      const list = listNamespace.map(x => {
        return {
          namespaceName: {
            name: x.namespaceName.name
          },
          disabled: Boolean(!x.namespaceInfo.active || x.namespaceInfo.depth === 3),
          idToHex: x.idToHex,
          type: 1
        }
      })
      return list
    },
    getNamespacesFromAddress () {
      let namespace = null
      let arrayNamespace = this.rootNamespace
      namespace = this.namespacesFromAddress(this.currentAccount.simpleWallet.address.address)
      if (namespace) {
        arrayNamespace = this.rootNamespace.concat(this.disabledNamespaceList(namespace))
      }
      return arrayNamespace
    },
    triggerClick (event) {
      const namespaceSelect = this.itemsNamespace.find(x => x.idToHex === event)
      this.$emit('action', namespaceSelect)
    }
  },
  beforeMount () {
    this.form.selectNamespace = this.rootNamespace[0]
    this.$emit('action', this.form.selectNamespace)
  }
}
</script>
