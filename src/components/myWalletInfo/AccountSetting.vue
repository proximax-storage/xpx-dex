<template>
  <v-col class="pa-3 12">
    <account-edit />
    <account-info />
    <account-backup />

    <!-- <v-row class="pt-3 ml-5">
      <v-col cols="4">
        <v-row>
          <v-col cols="12" class="mx-auto d-flex justify-center subtitle-1 font-weight-black"
            >Private key</v-col
          >
          <v-col cols="12" class="pr-8 pl-8 justify-center align-center">
            <template v-if="!showPK">
              <v-form v-model="passwordPkValid" ref="formPasswordPk">
                <v-text-field
                  ref="passwordPk"
                  dense
                  v-model="form.passwordPk"
                  :append-icon="configForm.passwordPk.show ? 'mdi-eye' : 'mdi-eye-off'"
                  :minlength="configForm.passwordPk.min"
                  :maxlength="configForm.passwordPk.max"
                  :counter="configForm.passwordPk.max"
                  :color="inputStyle"
                  :rules="[configForm.passwordPk.rules.min, configForm.passwordPk.rules.max]"
                  :label="configForm.passwordPk.label"
                  :type="configForm.passwordPk.show ? 'text' : 'password'"
                  name="password"
                  hint
                  @click:append="configForm.passwordPk.show = !configForm.passwordPk.show"
                ></v-text-field>
              </v-form>
            </template>
            <template v-if="showPK">
              <v-row>
                <v-col cols="10" class="mx-auto caption justify-center align-center">
                  <div style="word-wrap: break-word">{{ showPK }}</div>
                </v-col>
                <v-col cols="2" class="d-flex align-center">
                  <v-btn text icon large @click="$generalService.doCopy('Private key', showPK)">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-col>
        </v-row>
        <v-row>
        </v-row>
        <custom-button
          v-if="!showPK"
          @action="action"
          :align="'center'"
          :arrayBtn="getArrayBtn[0]"
        ></custom-button>
        <custom-button
          v-if="showPK"
          @action="action"
          :align="'center'"
          :arrayBtn="getArrayBtn[2]"
        ></custom-button>
      </v-col>
      <v-divider class="mx-1 mt-12" inset vertical></v-divider>
      <v-col cols="4">
        <v-row>
          <v-col cols="12" class="mx-auto d-flex justify-center subtitle-1 font-weight-black"
            >WLT file</v-col
          >
          <v-col cols="12" class="pr-8 pl-8 mx-auto d-flex justify-center align-center">
            <v-form v-model="passwordWLTValid" ref="formpasswordWLT">
              <v-text-field
                dense
                v-model="form.passwordWLT"
                :append-icon="configForm.passwordWLT.show ? 'mdi-eye' : 'mdi-eye-off'"
                :minlength="configForm.passwordWLT.min"
                :maxlength="configForm.passwordWLT.max"
                :counter="configForm.passwordWLT.max"
                :color="inputStyle"
                :rules="[configForm.passwordWLT.rules.min, configForm.passwordWLT.rules.max]"
                :label="configForm.passwordWLT.label"
                :type="configForm.passwordWLT.show ? 'text' : 'password'"
                name="password"
                hint
                @click:append="configForm.passwordWLT.show = !configForm.passwordWLT.show"
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <v-row>
        </v-row>
        <custom-button
          @action="action"
          :align="'center'"
          :arrayBtn="getArrayBtn[1]"
        ></custom-button>
      </v-col>
    </v-row> -->
  </v-col>
</template>
<script>
// import { decrypt, exportAccount } from '@/services/account-wallet-service'
// import { mapGetters } from 'vuex'
export default {
  // data () {
  //   return {
  //     arrayBtn: null,
  //     configForm: null,
  //     form: {
  //       passwordPk: null,
  //       passwordWLT: null
  //     },
  //     showPK: null,
  //     inputStyle: 'inputStyle',
  //     passwordPkValid: null,
  //     passwordWLTValid: null
  //   }
  // },
  // computed: {
  //   ...mapGetters('accountStore', ['currentAccount']),
  //   getArrayBtn () {
  //     const arrayBtn = this.arrayBtn
  //     arrayBtn[0]['showPK'].disabled = !this.passwordPkValid
  //     arrayBtn[1]['downloadWLT'].disabled = !this.passwordWLTValid
  //     return arrayBtn
  //   }
  // },
  components: {
    'account-edit': () => import('@/components/myWalletInfo/AccountEdit'),
    'account-info': () => import('@/components/myWalletInfo/AccountInfo'),
    'account-backup': () => import('@/components/myWalletInfo/AccountBackup')
    // 'custom-button': () => import('@/components/shared/Buttons')
  }
  // beforeMount () {
  //   this.configForm = {
  //     passwordPk: this.$configForm.password(),
  //     passwordWLT: this.$configForm.password()
  //   }
  //   this.arrayBtn = [
  //     {
  //       showPK: this.$configForm.buildButton('Show', 'showPK', 'showPK', 'white', 'primary--text')
  //     },
  //     {
  //       downloadWLT: this.$configForm.buildButton(
  //         'Download',
  //         'download',
  //         'download',
  //         'white',
  //         'primary--text'
  //       )
  //     },
  //     {
  //       hidden: this.$configForm.buildButton(
  //         'Hidden',
  //         'hiddenPk',
  //         'hiddenPk',
  //         'white',
  //         'primary--text'
  //       )
  //     }
  //   ]
  // },
  // methods: {
  //   action (action) {
  //     switch (action) {
  //       case 'showPK':
  //         this.showPK = null
  //         let common = decrypt(this.currentAccount.simpleWallet, this.form.passwordPk)
  //         if (common) {
  //           this.showPK = common.privateKey
  //         }
  //         break
  //       case 'hiddenPk':
  //         this.showPK = null
  //         break
  //       case 'download':
  //         if (decrypt(this.currentAccount.simpleWallet, this.form.passwordWLT)) {
  //           exportAccount(this.currentAccount)
  //         }
  //         break
  //     }
  //   }
  // }
}
</script>
