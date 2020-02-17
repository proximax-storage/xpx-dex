<template>
  <v-container class="fill-height">
    <template v-if="!dataWalletCreated">
      <v-row justify="center" align="center">
        <v-col cols="8" justify="center" align="center">
          <!-- <v-card elevation="1" class="pb-10"> -->
          <v-form v-model="valid" ref="form">
            <v-row>
              <v-col cols="11" class="title font-italic font-weight-medium text-left"
                >{{ title }}
              </v-col></v-row
            >
            <v-row>
              <v-col cols="11" class="mx-auto pt-0">
                <v-row>
                  <!-- Wallet name -->
                  <v-col cols="12">
                    <v-text-field
                      v-model.trim="accountName"
                      :loading="searchingWalletName"
                      :disabled="searchingWalletName"
                      :label="configForm.accountName.label"
                      :minlength="configForm.accountName.min"
                      :maxlength="configForm.accountName.max"
                      :counter="configForm.accountName.max"
                      :color="inputStyle"
                      :rules="[
                        configForm.accountName.rules.required,
                        configForm.accountName.rules.min,
                        configForm.accountName.rules.max,
                        walletIsRepeat
                      ]"
                    ></v-text-field>
                  </v-col>
                  <!-- Private Key -->
                  <v-col cols="12" class="pb-0 pt-0">
                    <v-text-field
                      v-model="privateKey"
                      :append-icon="configForm.privateKey.show ? 'mdi-eye' : 'mdi-eye-off'"
                      :minlength="configForm.privateKey.min"
                      :maxlength="configForm.privateKey.max"
                      :counter="configForm.privateKey.max"
                      :color="inputStyle"
                      :rules="[
                        configForm.privateKey.rules.required,
                        configForm.privateKey.rules.min,
                        configForm.privateKey.rules.max,
                        configForm.privateKey.rules.isHex
                      ]"
                      :label="configForm.privateKey.label"
                      :type="configForm.privateKey.show ? 'text' : 'password'"
                      name="privateKey"
                      hint
                      @click:append="configForm.privateKey.show = !configForm.privateKey.show"
                    >
                      <!-- <template v-slot:prepend-inner>
                          <v-img
                            class="pr-2 mt-1"
                            alt="logo"
                            height="20"
                            width="20"
                            :src="require(`@/assets/img/${configForm.privateKey.icon}`)"
                          ></v-img>
                        </template> -->

                      <!--<template v-slot:append-outer>
                        <v-btn
                          title="Only images containing QR CODE"
                          @click="openInputFile"
                          color="primary"
                          fab
                          x-small
                          dark
                        >
                          <v-icon>mdi-qrcode-scan</v-icon>
                        </v-btn>

                        <qrcode-capture
                          v-show="false"
                          id="scanPrivateKey"
                          @detect="onDetect"
                        />
                      </template> -->
                    </v-text-field>
                  </v-col>
                  <!-- Password -->
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-text-field
                      v-model="passwords.password"
                      :append-icon="configForm.password.show ? 'mdi-eye' : 'mdi-eye-off'"
                      :minlength="configForm.password.min"
                      :maxlength="configForm.password.max"
                      :counter="configForm.password.max"
                      :color="inputStyle"
                      :rules="[
                        configForm.password.rules.required,
                        configForm.password.rules.min,
                        configForm.password.rules.max
                      ]"
                      :label="configForm.password.label"
                      :type="configForm.password.show ? 'text' : 'password'"
                      name="password"
                      hint
                      @click:append="configForm.password.show = !configForm.password.show"
                    ></v-text-field>
                  </v-col>

                  <!-- Password confirm-->
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-text-field
                      v-model="passwords.confirmPassword"
                      :append-icon="configForm.password.show ? 'mdi-eye' : 'mdi-eye-off'"
                      :minlength="configForm.password.min"
                      :maxlength="configForm.password.max"
                      :counter="configForm.password.max"
                      :color="inputStyle"
                      :rules="[
                        configForm.password.rules.required,
                        configForm.password.rules.min,
                        configForm.password.rules.max,
                        isMatch(passwords.password, passwords.confirmPassword, 'Password')
                      ]"
                      :type="configForm.password.show ? 'text' : 'password'"
                      label="Confirm Password"
                      hint="Confirm Password"
                      @click:append="configForm.password.show = !configForm.password.show"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- Buttons -->
            <custom-buttons @action="action" :arrayBtn="getArrayBtn"></custom-buttons>
          </v-form>
          <!-- </v-card> -->
        </v-col>
      </v-row>
    </template>
    <template v-if="dataWalletCreated">
      <wallet-create :walletInfo="dataWalletCreated"></wallet-create>
    </template>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
import generalMixins from '../../mixins/general-mixin'
import walletMixins from '../../mixins/wallet-mixin'
export default {
  mixins: [generalMixins, walletMixins],
  data: () => {
    return {
      accountName: '',
      valid: false,
      configForm: null,
      dataWalletCreated: null,
      passwords: { password: '', confirmPassword: '' },
      title: 'New account from a existing private key',
      sendingForm: false,
      arrayBtn: null,
      searchingWalletName: false,
      networkSelected: null,
      privateKey: '',
      walletIsRepeat: true,
      inputStyle: 'inputStyle'
    }
  },
  computed: {
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn['clear'].disabled = this.sendingForm
      arrayBtn['create'].disabled = !this.valid || this.sendingForm || this.searchingWalletName
      arrayBtn['create'].loading = this.sendingForm
      return arrayBtn
    }
  },
  components: {
    // 'big-title': () => import('@/components/shared/BigTitle'),
    'custom-buttons': () => import('@/components/shared/Buttons'),
    'wallet-create': () => import('@/components/wallet/WalletCreate')
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
      this.searchingWalletName = false
      this.sendingForm = false
      this.$refs.form.reset()
    },
    sendForm () {
      try {
        if (this.valid && !this.sendingForm) {
          this.sendingForm = true
          this.SHOW_LOADING(true)
          const walletCreated = this.createWallet({
            default: true,
            firstAccount: true,
            walletName: this.accountName,
            network: this.networkSelected.value,
            password: this.passwords.password,
            privateKey: this.privateKey
          })
          setTimeout(() => {
            this.clear()
            this.sendingForm = false
            this.SHOW_LOADING(false)
            if (walletCreated.status) {
              this.dataWalletCreated = walletCreated
            }
          }, 500)
        }
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
    },
    validateWalletName () {
      const usr = this.accountName
      if (usr && usr !== '' && usr.length >= this.configForm.accountName.min) {
        this.searchingWalletName = true
        setTimeout(() => {
          if (this.getWalletByName(usr, this.networkSelected.value)) {
            this.searchingWalletName = false
            this.walletIsRepeat = `${usr} already exists, try another wallet name.`
            return
          }

          this.walletIsRepeat = true
          this.searchingWalletName = false
        }, 500)
      }
    },
    isMatch (value1, value2, nameValidation = '') {
      return this.$generalService.isMatch(value1, value2, nameValidation)
    }
  },
  watch: {
    accountName (newVal) {
      this.debouncedValidateWalletName()
    }
  },
  beforeMount () {
    const networks = this.$blockchainProvider.getNetworkTypes()
    this.networkSelected = networks.testnet
    this.debouncedValidateWalletName = this.lodash.debounce(this.validateWalletName, 500)
    this.configForm = this.getConfigForm()
    this.arrayBtn = {
      clear: this.typeButtons().clear,
      create: this.typeButtons().create
    }
  }
}
</script>
