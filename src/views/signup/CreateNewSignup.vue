<template>
  <v-container class="fill-height">
    <v-container>
      <v-row class="d-flex justify-center align-center mb-8 mt-1">
        <img :src="require('@/assets/img/logo-dex-blanco.svg')" alt="logo" height="70" />
      </v-row>
      <template v-if="!dataWalletCreated">
        <v-row class="d-flex justify-center align-center">
          <v-col xl="7" lg="7" md="7" sm="8" xs="12">
            <v-card elevation="1" class="pb-5 leve">
              <v-form v-model="valid" ref="form">
                <v-card-text>
                  <v-row>
                    <v-col cols="11" class="mx-auto pt-0 pb-0">
                      <v-row>
                        <v-col
                          cols=" 12 pt-0"
                          class="mx-auto title font-italic font-weight-medium pb-0"
                        >{{ title }}</v-col>
                        <!-- Wallet name -->
                        <v-col cols="12">
                          <v-text-field
                            v-on:keyup="validateWalletName"
                            v-model.trim="accountName"
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

                        <!-- Password -->
                        <v-col cols="12" sm="12" md="6" lg="6">
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
                        <v-col cols="12" sm="12" md="6" lg="6">
                          <v-text-field
                            v-model="passwords.confirmPassword"
                            :append-icon="configForm.confirmPassword.show ? 'mdi-eye' : 'mdi-eye-off'"
                            :minlength="configForm.confirmPassword.min"
                            :maxlength="configForm.confirmPassword.max"
                            :counter="configForm.confirmPassword.max"
                            :color="inputStyle"
                            :rules="[
                              configForm.confirmPassword.rules.required,
                              configForm.confirmPassword.rules.min,
                              configForm.confirmPassword.rules.max,
                              isMatch(passwords.password, passwords.confirmPassword, 'Password')
                            ]"
                            :type="configForm.confirmPassword.show ? 'text' : 'password'"
                            label="Confirm Password"
                            hint="Confirm Password"
                            @click:append="configForm.confirmPassword.show = !configForm.confirmPassword.show"
                          ></v-text-field>
                        </v-col>
                      </v-row>
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
        <router-link class="font-italic font-weight-medium" to="/">Go to home page</router-link>
      </v-row>
    </v-container>
  </v-container>
</template>
<script>
import { mapMutations } from 'vuex'
import { getWalletByName, createWallet } from '@/services/account-wallet-service'
export default {
  data: () => {
    return {
      accountName: null,
      title: 'New account',
      valid: false,
      configForm: null,
      walletIsRepeat: true,
      passwords: { password: '', confirmPassword: '' },
      sendingForm: false,
      arrayBtn: null,
      dataWalletCreated: null,
      networkSelected: null,
      inputStyle: 'inputStyle'
    }
  },
  beforeMount () {
    const networks = this.$blockchainProvider.getNetworkTypes()
    this.networkSelected = networks[0]
    this.configForm = {
      accountName: this.$configForm.walletAccountName('Account name'),
      password: this.$configForm.password(),
      confirmPassword: this.$configForm.password('Confirm password')
    }
    this.arrayBtn = {
      create: this.$configForm.buildButton('Create', 'create', 'create', 'primary', 'white--text'),
      clear: this.$configForm.buildButton('Clear', 'clear', 'clear', 'primary', 'white--text')
    }
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
  components: {
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
        const response = createWallet({
          default: true,
          firstAccount: true,
          walletName: this.accountName,
          network: this.networkSelected.value,
          password: this.passwords.password
        })
        console.log('response', response)
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
          if (response.status) {
            this.dataWalletCreated = response
          }
        }, 500)
      }
    },
    validateWalletName () {
      const usr = this.accountName
      if (usr && usr !== '' && usr.length >= this.configForm.accountName.min) {
        if (getWalletByName(usr, this.networkSelected.value)) {
          this.walletIsRepeat = `${usr} already exists, try another wallet name`
          return
        }
        this.walletIsRepeat = true
      }
    },
    isMatch (value1, value2, nameValidation = '') {
      return this.$configForm.isMatch(value1, value2, nameValidation)
    }
  }
}
</script>
