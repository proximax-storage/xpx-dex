<template>
  <v-container class="fill-height">
    <v-container>
      <v-row class="d-flex justify-center align-center mb-8 mt-1">
        <img
          :src="require('@/assets/img/logo-dex-blanco.svg')"
          alt="logo"
          height="70"
        />
      </v-row>
      <template v-if="!dataWalletCreated">
        <v-row class="d-flex justify-center align-center">
          <v-col
            xl="7"
            lg="7"
            md="7"
            sm="8"
            xs="12"
          >
            <v-card
              elevation="1"
              class="pb-5 leve"
            >
              <v-form
                v-model="valid"
                ref="form"
              >
                <v-card-text>
                  <v-row class="d-flex justify-center">
                    <v-col
                      cols="10"
                      class="pt-0 pb-0"
                    >
                      <file-input
                        @inputFile="inputFile"
                        :lengthFile="lengthFile"
                        :sizeFile="sizeFile"
                        :docsType="docsType"
                        :maxAllowed="maxAllowed"
                        ref="inputFile"
                      ></file-input>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <!-- Buttons -->
                  <custom-buttons
                    @action="action"
                    :arrayBtn="getArrayBtn"
                    :align="'start'"
                    :type="'text'"
                  ></custom-buttons>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-if="dataWalletCreated">
        <wallet-create :walletInfo="dataWalletCreated"></wallet-create>
      </template>
      <v-row class="d-flex justify-center align-center ma-4">
        <router-link
          class="font-italic font-weight-medium"
          to="/"
        >Go to home page</router-link>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
// import { createWallet, getWalletByName } from '@/services/account-wallet-service'
export default {
  data: () => {
    return {
      docsType: '.wlt',
      sizeFile: 5,
      files: [],
      lengthFile: 1,
      maxAllowed: '1',
      // accountName: '',
      valid: false,
      // configForm: null,
      dataWalletCreated: null,
      // passwords: { password: '', confirmPassword: '' },
      // title: 'New account',
      sendingForm: false,
      arrayBtn: null,
      networkSelected: null,
      // privateKey: '',
      walletIsRepeat: true
      // inputStyle: 'inputStyle'
    }
  },
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons'),
    'wallet-create': () => import('@/components/wallet/WalletCreate'),
    'file-input': () => import('@/components/shared/FileInput')
  },
  computed: {
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn['clear'].disabled = this.sendingForm
      arrayBtn['create'].disabled = !this.valid || this.sendingForm
      arrayBtn['create'].loading = this.sendingForm
      return arrayBtn
    }
  },
  beforeMount () {
    this.networkSelected = this.$blockchainProvider.filterNetworkTypeFromString(this.$store.getters.environment.connectionNodes.networkType)
    // this.configForm = {
    //   accountName: this.$configForm.walletAccountName('Account name'),
    //   privateKey: this.$configForm.privateKey(),
    //   password: this.$configForm.password(),
    //   confirmPassword: this.$configForm.password('Confirm password')
    // }
    this.arrayBtn = {
      clear: this.$configForm.buildButton('Clear', 'clear', 'clear', 'primary', 'white--text'),
      create: this.$configForm.buildButton('Create', 'create', 'create', 'primary', 'white--text')
    }
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'SHOW_SNACKBAR']),
    action (action) {
      if (action === 'create') {
        this.sendForm()
      } else {
        this.clear()
      }
    },
    clear () {
      this.walletIsRepeat = true
      this.sendingForm = false
      this.$refs.form.reset()
      this.$refs.inputFile.clean()
      this.files = []
    },
    inputFile (val = []) {
      this.files = val
      if (val.length > 0) {
        this.isValidFile = true
      } else {
        this.isValidFile = false
      }
    }
  }
}
</script>
