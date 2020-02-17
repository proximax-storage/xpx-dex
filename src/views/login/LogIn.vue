<template>
  <v-container class="fill-height">
    <template>
      <v-row justify="center" align="center">
        <v-col cols="8">
          <v-row class="mx-auto">
            <v-col cols="6 pr-0 ">
              <!-- <v-card class="pb-10" utlined height="320"> -->
              <v-form v-model="valid" ref="form">
                <!-- <v-card-title class=" font-italic font-weight-medium pb-0"> -->
                <v-col cols="12" class="font-italic font-weight-medium pb-0">
                  <span class="title sky--text">Welcome back </span>
                  <br />
                  <span class="subtitle-1">Ready to be?</span>
                </v-col>
                <!-- </v-card-title> -->
                <!-- <v-card-text> -->
                <!-- Account -->
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
                  <custom-buttons @action="action" :arrayBtn="getArrayBtn[0]"></custom-buttons>
                </v-col>
                <!-- </v-card-text> -->
              </v-form>
              <!-- </v-card> -->
            </v-col>
            <v-col cols="6 pl-0 sky">
              <!-- <v-card utlined class="pb-10 sky " height="320"> -->
              <v-col cols="12" class="font-italic font-weight-medium pb-0">
                <div>
                  <span class="title white--text">Create your Account, </span>
                  <br />
                  <span class="subtitle-1">is very easy.</span>
                </div>
              </v-col>
              <v-col cols="12">
                <!-- Buttons -->
                <custom-buttons @action="action" :arrayBtn="getArrayBtn[1]"></custom-buttons>
              </v-col>
              <!-- </v-card> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
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
      items: [
        {
          countryCode: 'CA',
          countryName: 'Canada'
        }
      ],
      wallet: null,
      arrayBtn: null,
      password: null,
      configForm: null,
      outline: false,
      inputStyle: 'inputStyle',
      valid: false,
      sendingForm: false,
      wallets: null
      // accountName: '',
      // title: 'Welcome back'
      // valid: false,
      // configForm: null,
      // walletIsRepeat: true,
      // passwords: { password: '', confirmPassword: '' },
      // searchingWalletName: false,

      // dataWalletCreated: null,
      // networkSelected: null,
      // inputStyle: 'inputStyle'
    }
  },
  methods: {
    ...mapMutations('accountStore', ['LOGIN']),
    ...mapMutations(['SHOW_LOADING', 'SHOW_SNACKBAR']),
    action (action) {
      console.log('action', action)
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
        const wallet = this.getWalletByName(this.wallet)
        const auth = this.auth(this.password, wallet)
        console.log('auth', auth)
        if (auth) {
          setTimeout(() => {
            this.clear()
            this.sendingForm = false
            this.SHOW_LOADING(false)
            this.LOGIN(wallet)
            this.$router.push('dashboard')
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
    // 'big-title': () => import('@/components/shared/BigTitle'),
    'custom-buttons': () => import('@/components/shared/Buttons')
  },
  beforeMount () {
    const networks = this.$blockchainProvider.getNetworkTypes()
    console.log('networks', networks)
    this.configForm = this.getConfigForm()
    this.wallets = this.getWallets()
    console.log(this.wallets)
    this.arrayBtn = [
      {
        login: this.typeButtonsLogin().login
      },
      {
        letsgo: this.typeButtonsLogin().letsgo
      }
    ]
  }
}
</script>
