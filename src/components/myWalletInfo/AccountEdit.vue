<template>
  <div class="ma-2 ml-7 mx-auto">
    <div class="caption font-weight-light">Account Name:</div>
    <div class="ml-1 headline font-weight-regular">
      <v-row v-if="editName">
        <v-form v-model="valid" ref="form" class="row">
          <v-col cols="8">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model.trim="accountNewName"
                  :loading="searchingWalletName"
                  :disabled="searchingWalletName"
                  :label="configForm.accountName.label"
                  :minlength="configForm.accountName.min"
                  :maxlength="configForm.accountName.max"
                  :counter="configForm.accountName.max"
                  :color="inputStyle"
                  :rules="[
                              configForm.accountName.rules.required,

                              configForm.accountName.rules.max,
                              walletIsRepeat
                            ]"
                ></v-text-field>
              </v-col>
              <v-col cols="4" class="d-flex justify-start align-center">
                <v-icon
                  medium
                  class="font-weight-regular"
                  @click="editNameF('editChange')"
                >mdi-pencil</v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-form>
      </v-row>
      <v-row v-if="!editName">
        <v-col cols="6" class="d-flex justify-start align-center">
          {{nameCurrentWallet}}
          <span class="ml-3">
            <v-icon
              v-if="!editName"
              medium
              class="font-weight-regular"
              @click="editNameF('editName')"
            >mdi-pencil</v-icon>
          </span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { changeName, getWalletByName } from '@/services/account-wallet-service'
// changeName
export default {
  data () {
    return {
      valid: false,
      editName: false,
      accountNewName: null,
      searchingWalletName: false,
      walletIsRepeat: true,
      configForm: null,
      inputStyle: 'inputStyle',
      timeGetvalidateWalletName: null
    }
  },
  computed: {
    ...mapGetters('walletStore', ['nameCurrentWallet'])
  },
  methods: {
    editNameF (v) {
      if (v === 'editName') {
        this.accountNewName = this.nameCurrentWallet
        this.editName = !this.editName
      } else {
        setTimeout(() => {
          if (
            this.accountNewName &&
            this.walletIsRepeat &&
            !this.searchingWalletName &&
            this.valid
          ) {
            changeName(this.nameCurrentWallet, this.accountNewName)
            this.editName = false
          }
        }, 500)
      }
    },
    validateWalletName () {
      const usr = this.accountNewName
      if (usr && usr !== '' && usr.length >= this.configForm.accountName.min) {
        this.searchingWalletName = true
        setTimeout(() => {
          if (getWalletByName(usr)) {
            this.searchingWalletName = false
            this.walletIsRepeat = `${usr} already exists, try another wallet name`
            return
          }

          this.walletIsRepeat = true
          this.searchingWalletName = false
        }, 500)
      }
    }
  },
  beforeMount () {
    this.configForm = {
      accountName: this.$configForm.walletAccountName('Account name')
    }
  },
  watch: {
    accountNewName (newVal) {
      if (newVal !== this.nameCurrentWallet) {
        if (this.timeGetvalidateWalletName) clearTimeout(this.timeGetvalidateWalletName)
        this.timeGetvalidateWalletName = setTimeout(() => {
          this.validateWalletName()
        }, 500)
      }
    }
  }
}
</script>
