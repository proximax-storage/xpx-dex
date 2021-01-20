<template>
  <v-container class="fill-height">
    <v-container>
      <v-row class="d-flex justify-center align-center mb-8 mt-1">
        <img :src="require('@/assets/img/logo-dex-blanco.svg')" alt="logo" height="70" />
      </v-row>
      <template v-if="!dataWalletCreated">
        <v-row class="d-flex justify-center align-center">
          <v-col xl="6" lg="6" md="7" sm="7" xs="12">
            <v-card elevation="1" class="pb-5 leve">
              <v-form v-model="valid" ref="form">
                <v-card-text>
                  <v-row class="d-flex justify-center">
                    <v-col cols="12" class="mx-auto title font-italic font-weight-medium pb-2">{{ title }}</v-col>

                    <v-col cols="10" class="pt-9">
                      <file-input @inputFile="inputFile" :lengthFile="lengthFile" :sizeFile="sizeFile" :docsType="docsType" :maxAllowed="maxAllowed" ref="inputFile"></file-input>
                    </v-col>
                    <v-col cols="9" class="pt-4">
                      <!-- <v-alert icon="mdi-alert" dense outlined type="warning"> Import <strong>default</strong> account</v-alert> -->
                      <v-alert dense border="left" type="info" icon="mdi-alert">Import <strong>default</strong> account </v-alert>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <!-- Buttons -->
                  <custom-buttons @action="action" :arrayBtn="getArrayBtn" :align="'start'" :type="'text'"></custom-buttons>
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
        <router-link class="font-italic font-weight-medium" to="/">Go to home page</router-link>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
import * as CryptoJS from 'crypto-js'
import { importWalletWlt } from '@/services/account-wallet-service'
export default {
  data: () => {
    return {
      isValidFile: false,
      docsType: '.wlt',
      title: 'New account',
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
      arrayBtn['create'].disabled = !this.valid || this.sendingForm || !this.isValidFile
      arrayBtn['create'].loading = this.sendingForm
      return arrayBtn
    }
  },
  beforeMount () {
    this.networkSelected = this.$blockchainProvider.filterNetworkTypeFromString(this.$store.getters.environment.connectionNodes.networkType)
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
    sendForm () {
      if (this.files.length > 0) {
        this.sendingForm = true
        this.SHOW_LOADING(true)
        const myReader = new FileReader()
        myReader.onloadend = e => {
          const file = CryptoJS.enc.Base64.parse(myReader.result)
          try {
            const walletCreated = importWalletWlt(JSON.parse(file.toString(CryptoJS.enc.Utf8)))
            setTimeout(() => {
              this.clear()
              this.sendingForm = false
              this.SHOW_LOADING(false)
              if (walletCreated.status) {
                this.dataWalletCreated = walletCreated
              } else {
                return this.$store.commit('SHOW_SNACKBAR', {
                  snackbar: true,
                  text: `${walletCreated.msg}`,
                  color: 'errorIntense'
                })
              }
            }, 500)
          } catch (error) {
            this.SHOW_LOADING(false)
            this.clear()
            this.sendingForm = false
            this.$store.commit('SHOW_SNACKBAR', {
              snackbar: true,
              text: 'An error has occurred, try again',
              color: 'warning'
            })
          }
        }

        myReader.readAsText(this.files[0])
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
