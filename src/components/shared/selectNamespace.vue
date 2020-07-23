<template>
  <v-col cols="6">
    <v-select
      class="pt-1"
      v-model="form.selectNamespace"
      :items="itemsNamespace"
      :item-disabled="itemsNamespace.disabled"
      @change="changeSelectNamespace($event)"
      item-text="namespaceName.name"
      item-value="idToHex"
      attach
      dense
      :rules="[]"
      :color="inputStyle"
      label="namespace"
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
          disabled: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters('namespaceStore', ['namespacesFromAddress']),
    ...mapGetters('accountStore', ['currentAccount']),
    itemsNamespace () {
      return this.getNamespacesFromAddress()
    }
  },
  methods: {
    changeSelectNamespace (event) {
      console.log('changeSelectNamespace:', event)
    },
    disabledNamespaceList (listNamespace) {
      const list = listNamespace.map(x => {
        return {
          namespaceName: {
            name: x.namespaceName.name
          },
          disabled: Boolean(!x.namespaceInfo.active || x.namespaceInfo.depth === 3),
          idToHex: x.idToHex
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
    }
  },
  beforeMount () {
    console.log(this.namespacesFromAddress(this.currentAccount.simpleWallet.address.address))
  }
}
</script>
