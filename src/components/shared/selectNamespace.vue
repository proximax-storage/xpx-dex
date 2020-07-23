<template>
  <v-col cols="6">
    <v-select
      class="pt-1"
      v-model="form.selectNamespace"
      :items="itemsNamespace"
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
      }
    }
  },
  computed: {
    ...mapGetters('namespaceStore', ['namespacesFromAddress']),
    ...mapGetters('accountStore', ['currentAccount']),
    itemsNamespace () {
      return this.namespacesFromAddress(this.currentAccount.simpleWallet.address.address)
    }
  },
  methods: {
    changeSelectNamespace (event) {
      console.log('changeSelectNamespace:', event)
    }
  },
  beforeMount () {
    console.log(this.namespacesFromAddress(this.currentAccount.simpleWallet.address.address))
  }
}
</script>
