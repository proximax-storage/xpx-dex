<template>
  <v-row class="ml-3">
    <v-col xs="12" sm="12" md="10" lg="6" xl="6" class="d-flex mx-auto">
      <v-row>
        <v-col xs="3" sm="3" md="3" lg="2" xl="2" class="align-center">
          <qrcode-vue :value="address.plain()" :size="size" level="L"></qrcode-vue>
        </v-col>
        <v-col xs="7" sm="7" md="7" lg="8" xl="8" class="align-center">
          <div class="subtitle-1 font-weight-black">Address</div>
          <div>{{address.pretty()}}</div>
        </v-col>
        <v-col xs="2" sm="2" md="2" lg="2" xl="2" class="d-flex align-center">
           <v-btn text icon large @click="$generalService.doCopy('Address', address.plain())">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col xs="12" sm="12" md="10" lg="6" xl="6" class="d-flex mx-auto">
      <v-row>
        <v-col cols="10" class="align-center">
          <div class="subtitle-1 font-weight-black">Public key</div>
          <div style="word-wrap: break-word">{{publicKey}}</div>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-btn text icon large @click="$generalService.doCopy('Public Key', publicKey)">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <!-- <div>
    <v-row>
      <v-col cols="12" class="d-flex justify-center subtitle-1 font-weight-black">Sirius address</v-col>
      <v-col cols="12" class="d-flex justify-center align-center">
        <qrcode-vue :value="address.plain()" :size="size" level="L"></qrcode-vue>
      </v-col>
      <v-col cols="12" class="d-flex justify-center align-center">{{address.pretty()}}</v-col>
    </v-row>
    <custom-button @action="action" :align="'center'" :arrayBtn="getArrayBtn"></custom-button>
  </div>-->

  <!-- <v-row class="pt-3 justify-center">asd</v-row> -->
</template>
<script>
import { mapGetters } from 'vuex'
import QrcodeVue from 'qrcode.vue'
export default {
  data () {
    return { theme: 'light', address: null, publicKey: null, arrayBtn: null, size: 75 }
  },
  //   },
  components: {
    //   'custom-button': () => import('@/components/shared/Buttons'),
    QrcodeVue
  },
  computed: {
    ...mapGetters('accountStore', ['currentAccount']),
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      return arrayBtn
    }
  },
  beforeMount () {
    this.address = this.$blockchainProvider.createRawAddress(
      this.currentAccount.simpleWallet.address.address
    )
    this.publicKey = this.currentAccount.publicKey
    this.arrayBtn = {
      copy: this.$configForm.buildButton('Copy', 'copy', 'copy', 'primary', 'white--text')
    }
  },
  methods: {
    copy (action) {
      console.log('action', action)
    }
  }
}
</script>
<style>
.mouse-pointer {
  cursor: pointer;
}
</style>
