<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="8">
        <v-card elevation="10" class="pb-10">
          <v-card-title class="title font-italic font-weight-medium ">{{ title }} {{ walletName }}</v-card-title>
          <v-card-subtitle class="pa-0 pl-4">Has been created succesfully</v-card-subtitle>
          <v-row>
            <v-col cols="11" class="mx-auto pt-0">
              <v-row>
                <!-- <v-col cols="12" class="mx-auto">
                  <span class="body-1">Name: {{ walletName }}</span>
                </v-col> -->
              </v-row>
              <v-row>
                <v-col cols="10" class="mx-auto">
                  <span class="body-1">Adress:</span>
                  <br />
                  <span class="body-2 d-flex">{{ address }}</span>
                </v-col>
                <!-- Icon -->
                <v-col cols="2" class="text-right pt-7">
                  <v-btn text icon @click="doCopy('Address', address)">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row justify="center">
                <!-- Warning Message -->
                <v-col cols="12">
                  <v-alert
                    outlined
                    type="warning"
                    prominent
                    class="text-center line-h-1-02em"
                    dense
                  >
                    <span class="gray-black--text caption">
                      Make sure you store your private key in a safe place.
                      <br />Access to your digital assets cannot be recovered without it.
                    </span>
                  </v-alert>
                </v-col>
              </v-row>
              <v-row v-if="showPrivateKey">
                <v-col cols="10" class="mx-auto">
                  <span class="body-1">Private key:</span>
                  <br />
                  <span class="body-2 d-flex break-word">{{ privateKey }}</span>
                </v-col>
                <!-- Icon -->
                <v-col cols="2" class="text-right pt-7">
                  <v-btn text icon @click="doCopy('Private key', privateKey)">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <!-- Buttons -->
            <custom-buttons @action="action" :arrayBtn="buttons"></custom-buttons>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
export default {
  mixins: [generalMixins],
  props: ['walletInfo'],
  data: () => {
    return {
      address: '',
      arrayBtn: {
        showPvk: {
          key: 'showPvk',
          action: 'showPrivateKey',
          disabled: false,
          color: 'sky',
          loading: false,
          text: 'Show Private Key'
        },
        // savePaperWallet: {
        //   key: 'showPvk',
        //   action: 'savePaperWallet',
        //   disabled: false,
        //   color: 'primary',
        //   loading: false,
        //   text: 'Save Paper Wallet'
        // },
        continue: {
          key: 'continue',
          action: 'continue',
          disabled: false,
          color: 'sky',
          loading: false,
          text: 'Continue'
        }
      },
      privateKey: '',
      title: 'My account,',
      walletName: '',
      showPrivateKey: false
    }
  },
  methods: {
    action (action) {
      switch (action) {
        case 'showPrivateKey':
          this.showPrivateKey = !this.showPrivateKey
          break
        // case 'savePaperWallet':
        //   const pdf = this.$pdfGenerator.walletCreatedCertified(
        //     this.base64QR,
        //     this.address,
        //     this.walletName
        //   )
        //   pdf.save(`${this.walletName}_paper_wallet`)
        //   break
        case 'continue':
          // if (this.infoOwnedSwap) {
          //   this.SET_SWAP_DATA(this.infoOwnedSwap)
          //   this.$router.push('/swap-account-nis1-found').catch(e => {})
          // } else {
          this.$router.push('/').catch(e => {})
          // }
          break
      }
    }
  },
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons')
  },
  computed: {
    buttons () {
      const arrayBtn = this.arrayBtn
      arrayBtn['showPvk'].text = (this.showPrivateKey) ? 'Hide Private Key' : 'Show Private Key'
      return arrayBtn
    }
  },
  beforeMount () {
    const walletInfo = this.walletInfo.data
    this.address = walletInfo.accounts[0].address.pretty()
    this.privateKey = this.walletInfo.pvk
    this.walletName = walletInfo.name
  }
}
</script>
<style>
.break-word {
  -ms-word-break: break-all;
  word-break: break-all;

  word-break: break-word;

  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
</style>
