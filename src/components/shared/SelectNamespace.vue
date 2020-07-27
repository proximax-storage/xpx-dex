<template>
  <v-col cols="12">
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
      :color="inputStyle"
      :hint="`${form.selectNamespace.namespaceName.name}, alias: (${form.selectNamespace.aliasType})`"
      persistent-hint
      return-object
      label="Select name "
    ></v-select>
    <!-- :error="errorSelect" -->
  </v-col>
</template>
<script>
import { aliasType } from '@/services/namespace-service'
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
          namespaceInfo: null,
          namespaceName: {
            name: 'New Root Namespace'
          },
          idToHex: null,
          disabled: false,
          aliasType: 'none'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('namespaceStore', ['namespacesFromAddress', 'loading']),
    ...mapGetters('accountStore', ['currentAccount']),
    itemsNamespace () {
      return this.getNamespacesFromAddress()
    },
    errorSelect () {
      let error = false
      if (this.form.selectNamespace.namespaceInfo) {
        error = this.form.selectNamespace.namespaceInfo.hasAlias()
      }
      return error
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
          namespaceInfo: x.namespaceInfo,
          aliasType: x.namespaceInfo.hasAlias() ? aliasType(x.namespaceInfo.alias.type) : 'none'
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
      this.$emit('action', event)
    }
  },
  beforeMount () {
    this.form.selectNamespace = this.rootNamespace[0]
    this.$emit('action', this.form.selectNamespace)
  }
}
</script>
