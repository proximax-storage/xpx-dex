<template>
  <v-row class=" ma-2">
    <v-col
      xs="12"
      sm="12"
      md="12"
      lg="12"
      xl="6"
      col="12"
    >
      <v-row class="d-flex  flex-row">
        <div class="ma-2 d-flex align-sm-center" >
          <qrcode-vue
            :value="address.plain()"
            :size="size"
            level="L"
          ></qrcode-vue>
        </div>
        <div class="d-flex  flex-row ma-2" >
          <div>
            <div class="subtitle-1 font-weight-black">Address</div>
            <div>{{address.pretty()}}</div>
          </div>
          <div class="d-flex align-center">
            <v-btn
              text
              icon
              large
              @click="$generalService.doCopy('Address', address.plain())"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </div>
        </div>
      </v-row>
    </v-col>
    <v-col
      xs="12"
      sm="12"
      md="12"
      lg="12"
      xl="6"
      col="12"
    >
      <v-row class="d-flex  flex-row" >
        <div class="d-flex  flex-row ma-2">
          <div style="min-width: 40%;   flex-wrap:nowrap;">
            <div class="subtitle-1 font-weight-black">Public key</div>
            <div style="word-wrap: anywhere">{{publicKey}}</div>
          </div>
          <div class="d-flex align-center ma-4">
            <v-btn
              text
              icon
              large
              @click="$generalService.doCopy('Public Key', publicKey)"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </div>

        </div>
        <!-- <v-col
          cols="10"
          class="align-center"
        >
          <div class="subtitle-1 font-weight-black">Public key</div>
          <div style="word-wrap: break-word">{{publicKey}}</div>
        </v-col>
        <v-col
          cols="2"
          class="d-flex align-center"
        >
          <v-btn
            text
            icon
            large
            @click="$generalService.doCopy('Public Key', publicKey)"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-col> -->
      </v-row>
    </v-col>
    <!-- <v-col xs="12" sm="12" md="10" lg="6" xl="6" class="d-flex mx-auto">
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
    </v-col> -->
  </v-row>
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
    }
  }
}
</script>
<style>
.mouse-pointer {
  cursor: pointer;
}
</style>
