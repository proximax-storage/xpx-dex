<template>
  <v-container class="fill-height">
    <v-row class="d-flex justify-center align-center">
      <v-col xl="7" lg="7" md="7" sm="8" xs="12">
        <v-card elevation="1" class="pb-5">
          <v-row>
            <v-col cols="11" class="mx-auto">
              <v-row>
                <v-col cols="12" class="mx-auto title font-italic font-weight-medium pb-0">
                  <span
                    class="title font-italic font-weight-medium primary--text"
                  >{{ title }} {{ walletName }}</span>
                  <br />
                  <span
                    class="subtitle-1 font-italic font-weight-medium"
                  >Has been created succesfully</span>
                </v-col>
                <v-col cols="10" class="mx-auto">
                  <span class="body-1 font-weight-black">Adress:</span>
                  <br />
                  <span class="body-2 d-flex">{{ address }}</span>
                </v-col>
                <!-- Icon -->
                <v-col cols="2" class="text-right pt-7">
                  <v-btn text icon @click="$generalService.doCopy('Address', address)">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row justify="center"></v-row>
              <v-row v-if="showPrivateKey">
                <v-col cols="10" class="mx-auto">
                  <span class="body-1 font-weight-black">Private key:</span>
                  <br />
                  <span class="body-2 d-flex break-word">{{ privateKey }}</span>
                </v-col>
                <!-- Icon -->
                <v-col cols="2" class="text-right pt-7">
                  <v-btn text icon @click="$generalService.doCopy('Private key', privateKey)">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-card-actions>
            <!-- Buttons -->
            <custom-buttons @action="action" :arrayBtn="arrayBtn" :align="'start'" :type="'text'"></custom-buttons>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ['walletInfo'],
  data: () => {
    return {
      address: '',
      arrayBtn: {
        showPvk: {
          key: 'showPvk',
          action: 'showPrivateKey',
          disabled: false,
          color: 'primary',
          loading: false,
          text: 'Show Private Key'
        },
        continue: {
          key: 'continue',
          action: 'signin',
          disabled: false,
          color: 'primary',
          loading: false,
          text: 'Sign in'
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
        case 'signin':
          this.$router.push('login').catch(e => {})
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
      arrayBtn['showPvk'].text = this.showPrivateKey ? 'Hide Private Key' : 'Show Private Key'
      return arrayBtn
    }
  },
  beforeMount () {
    const walletInfo = this.walletInfo.data
    this.address = walletInfo.accounts[0].simpleWallet.address.pretty()
    this.privateKey = this.walletInfo.pvk
    this.walletName = walletInfo.username
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
