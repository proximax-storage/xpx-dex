<template>
  <v-row class="ma-2">
    <v-col
      xs="12"
      sm="12"
      md="12"
      lg="12"
      xl="12"
    >
      <div>
        <div class="caption font-weight-light">Account Name:</div>
        <div class="ml-1 headline font-weight-regular">
          <v-row v-if="editName">
            <v-form
              v-model="valid"
              ref="form"
              class="row"
            >
              <v-col cols="8">
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      v-model.trim="accountNewName"
                      :label="configForm.accountName.label"
                      v-on:keyup="validateWalletName"
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
                  <v-col
                    cols="4"
                    class="d-flex justify-start align-center"
                  >
                    <v-icon
                      medium
                      class="font-weight-regular"
                      @click="editNameF('editChange')"
                    >mdi-content-save-edit</v-icon>
                  </v-col>
                </v-row>
              </v-col>
            </v-form>
          </v-row>
          <v-row v-if="!editName">
            <v-col
              cols="6"
              class="d-flex justify-start align-center"
            >
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
    </v-col>
  </v-row>
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
      walletIsRepeat: true,
      configForm: null,
      inputStyle: 'inputStyle'
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
        // setTimeout(() => {
        if (this.accountNewName && this.walletIsRepeat && this.valid) {
          changeName(this.nameCurrentWallet, this.accountNewName)
          this.editName = false
        }
        // }, 500)
      }
    },
    validateWalletName () {
      const usr = this.accountNewName
      if (usr && usr !== '' && usr.length >= this.configForm.accountName.min) {
        if (getWalletByName(usr)) {
          this.walletIsRepeat = `${usr} already exists, try another wallet name`
          return
        }

        this.walletIsRepeat = true
      }
    }
  },
  beforeMount () {
    this.configForm = {
      accountName: this.$configForm.walletAccountName('Account name')
    }
  }
  // watch: {
  //   accountNewName (newVal) {
  //     if (newVal !== this.nameCurrentWallet) {
  //       if (this.timeGetvalidateWalletName) clearTimeout(this.timeGetvalidateWalletName)
  //       this.timeGetvalidateWalletName = setTimeout(() => {
  //         this.validateWalletName()
  //       }, 500)
  //     }
  //   }
  // }
}
</script>
