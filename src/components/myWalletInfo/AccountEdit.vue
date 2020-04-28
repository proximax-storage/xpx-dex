<template>
  <div class="ma-2 ml-7 mx-auto">
    <div class="caption font-weight-light">Account Name:</div>
    <div class="ml-1 headline font-weight-regular">
      {{nameCurrentWallet}}
      <span class>
        <v-icon medium class="font-weight-regular" @click="edit()">mdi-pencil</v-icon>
      </span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('walletStore', ['nameCurrentWallet'])
  },
  methods: {
    edit () {
      console.log('edit')
    }
  }
}
</script>
