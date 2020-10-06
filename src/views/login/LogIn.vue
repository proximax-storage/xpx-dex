<template>
  <v-container class="fill-height">
    <v-container>
      <template>
        <v-row class="d-flex justify-center align-center mb-8 mt-1">
          <img :src="require('@/assets/img/logo-dex-blanco.svg')" alt="logo" height="70" />
        </v-row>
        <v-row class="d-flex justify-center align-center">
          <v-col xl="6" lg="6" md="7" sm="8" xs="12">
            <v-row class="mx-auto v-card d-flex">
              <v-col cols="6 white card-border-bottom">
                <v-form v-model="valid" ref="form">
                  <v-col cols="12" class="font-italic font-weight-medium pb-0">
                    <span class="title primary--text">Welcome back</span>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="wallet"
                      :items="wallets"
                      item-text="username"
                      item-value="username"
                      attach
                      dense
                      :rules="[
                      configForm.wallet.rules.required,
                      configForm.wallet.rules.min,
                      configForm.wallet.rules.max
                    ]"
                      :color="inputStyle"
                      label="Select your account"
                    ></v-select>
                  </v-col>
                  <!-- Password -->
                  <v-col cols="12">
                    <v-text-field
                      autocomplete="on"
                      dense
                      v-model="password"
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
                  <v-col cols="12">
                    <!-- Buttons -->
                    <custom-buttons @action="action" :arrayBtn="getArrayBtn[0]" :type="'text'"></custom-buttons>
                  </v-col>
                </v-form>
              </v-col>
              <v-col cols="6 pl-0 leve">
                <v-col cols="12" class="font-italic font-weight-medium pb-0">
                  <div>
                    <span class="title primary--text">Create your Account</span>
                  </div>
                </v-col>
                <v-col cols="12">
                  <!-- Buttons -->
                  <custom-buttons @action="action" :arrayBtn="getArrayBtn[1]" :type="'text'"></custom-buttons>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- <v-row class="d-flex justify-center align-center ma-4">
          <router-link class="font-italic font-weight-medium" to="/">Go to home page</router-link>
        </v-row>-->
      </template>
    </v-container>
  </v-container>
</template>
<script>
import { mapMutations } from 'vuex'
import { getWalletByName, getWallets, logIn } from '@/services/account-wallet-service'
export default {
  data: () => {
    return {
      wallet: null,
      arrayBtn: [],
      password: null,
      configForm: null,
      outline: false,
      inputStyle: 'inputStyle',
      valid: false,
      sendingForm: false,
      wallets: getWallets()
    }
  },
  beforeMount () {
    this.configForm = {
      wallet: this.$configForm.walletAccountName(),
      password: this.$configForm.password()
    }
    this.arrayBtn = [
      {
        login: this.$configForm.buildButton('Log In', 'login', 'login', 'primary', 'white--text')
      },
      {
        letsgo: this.$configForm.buildButton(
          `Let's Go`,
          'letsgo',
          'letsgo',
          'primary',
          'white--text'
        )
      }
    ]
  },
  methods: {
    ...mapMutations('accountStore', ['LOGIN']),
    ...mapMutations(['SHOW_LOADING', 'SHOW_SNACKBAR']),
    action (action) {
      if (action === 'login') {
        this.sendForm()
      } else {
        this.$router.push({ path: 'select-signup-type' })
      }
    },
    sendForm () {
      if (this.valid && !this.sendingForm) {
        this.sendingForm = true
        this.SHOW_LOADING(true)
        const wallet = getWalletByName(this.wallet)
        const login = logIn(wallet, this.password)
        if (login) {
          setTimeout(() => {
            this.clear()
            this.sendingForm = false
            this.SHOW_LOADING(false)
            this.LOGIN(wallet)
            this.$router.push('searchOfferts')
          }, 500)
        } else {
          this.clear()
          this.sendingForm = false
          this.SHOW_LOADING(false)
        }
      }
    },
    clear () {
      this.sendingForm = false
      this.$refs.form.reset()
    }
  },
  computed: {
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn[0]['login'].disabled = !this.valid || this.sendingForm
      arrayBtn[0]['login'].loading = this.sendingForm
      return arrayBtn
    }
  },
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons')
  }
}
</script>
<style >
.card-border-bottom {
  border-bottom-left-radius: none !important;
  border-bottom-right-radius: none !important;
}
</style>
