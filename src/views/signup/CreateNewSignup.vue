<template>
  <v-container class="fill-height">
    <template v-if="!dataWalletCreated">
      <!-- <big-title></big-title> -->
      <v-row justify="center" align="center">
        <v-col cols="8" justify="center" align="center">
          <v-card elevation="10" class="pb-10">
            <v-form v-model="valid" ref="form">
              <v-card-title class="title font-italic font-weight-medium">{{ title }}</v-card-title>
              <v-row>
                <v-col cols="11" class="mx-auto pt-0">
                  <v-row>
                    <!-- Wallet name -->
                    <v-col cols="12">
                      <v-text-field
                        v-model.trim="accountName"
                        :label="configForm.accountName.label"
                        :minlength="configForm.accountName.min"
                        :maxlength="configForm.accountName.max"
                        :counter="configForm.accountName.max"
                        :rules="[
                          configForm.accountName.rules.required,
                          configForm.accountName.rules.min,
                          configForm.accountName.rules.max,
                          walletIsRepeat
                        ]"
                      ></v-text-field>
                    </v-col>

                    <!-- Password -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                      <v-text-field
                        v-model="passwords.password"
                        :append-icon="configForm.password.show ? 'mdi-eye' : 'mdi-eye-off'"
                        :minlength="configForm.password.min"
                        :maxlength="configForm.password.max"
                        :counter="configForm.password.max"
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
                    <v-col cols="12" sm="12" md="6" lg="6">
                      <v-text-field
                        v-model="passwords.confirmPassword"
                        :append-icon="configForm.password.show ? 'mdi-eye' : 'mdi-eye-off'"
                        :minlength="configForm.password.min"
                        :maxlength="configForm.password.max"
                        :counter="configForm.password.max"
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
          </v-card>
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
      title: 'New account',
      valid: false,
      configForm: null,
      walletIsRepeat: true,
      passwords: { password: '', confirmPassword: '' },
      sendingForm: false,
      arrayBtn: null,
      dataWalletCreated: null,
      networkSelected: null
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
      // this.searchingWalletName = false
      this.sendingForm = false
      this.$refs.form.reset()
    },
    enableDisableBtn (status) {
      this.arrayBtn.create.disabled = status
    },
    sendForm () {
      if (this.valid && !this.sendingForm) {
        this.sendingForm = true
        this.SHOW_LOADING(true)
        const response = this.createWallet({
          default: true,
          firstAccount: true,
          isMultisign: null,
          walletName: this.accountName,
          network: this.networkSelected.value,
          password: this.passwords.password
        })
        const snackbars = {
          snackbar: true,
          text: response.msg,
          color: 'error'
        }
        if (!response.status) {
          this.SHOW_LOADING(false)
          this.sendingForm = false
          return this.SHOW_SNACKBAR(snackbars)
        }
        setTimeout(() => {
          this.clear()
          this.sendingForm = false
          this.SHOW_LOADING(false)
          console.log('response', response)
          if (response.status) {
            this.dataWalletCreated = response
          }
        }, 500)
      }
    },
    isMatch (value1, value2, nameValidation = '') {
      return this.$generalService.isMatch(value1, value2, nameValidation)
    }
  },
  beforeMount () {
    const networks = this.$blockchainProvider.getNetworkTypes()
    this.networkSelected = networks.testnet
    console.log('networkSelected', this.networkSelected)
    this.configForm = this.getConfigForm()
    this.arrayBtn = {
      clear: this.typeButtons().clear,
      create: this.typeButtons().create
    }
  }
}
</script>
