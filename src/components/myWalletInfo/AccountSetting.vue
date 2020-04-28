<template>
  <v-col class="pa-3 12">
    <account-edit />
    <!-- </v-row> -->
    <v-row class="pt-1 ml-1">
      <v-col cols="12" class="ml-3 mx-auto caption d-flex justify-center align-center">
        <p>
          Disclosure: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis
          varius mauris, non aliquet libero. Pellentesque est eros. pharetra non finibus et,
          fermentum sed felis. Duis portito. purus a suscipit consequat
        </p>
      </v-col>
    </v-row>
    <account-info />
    <v-row class="pt-3 ml-5">
      <v-col cols="4">
        <v-row>
          <v-col
            cols="12"
            class="mx-auto d-flex justify-center subtitle-1 font-weight-black"
          >Private key</v-col>
          <v-col cols="12" class="pr-10 pl-10 mx-auto d-flex justify-center align-center">
            <v-text-field
              dense
              v-model="form.passwordPk"
              :append-icon="configForm.passwordPk.show ? 'mdi-eye' : 'mdi-eye-off'"
              :minlength="configForm.passwordPk.min"
              :maxlength="configForm.passwordPk.max"
              :counter="configForm.passwordPk.max"
              :color="inputStyle"
              :rules="[
                    configForm.passwordPk.rules.required,
                    configForm.passwordPk.rules.min,
                    configForm.passwordPk.rules.max
                  ]"
              :label="configForm.passwordPk.label"
              :type="configForm.passwordPk.show ? 'text' : 'password'"
              name="password"
              hint
              @click:append="configForm.passwordPk.show = !configForm.passwordPk.show"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- <div class="subtitle-1 font-weight-black">Private key</div> -->
      </v-col>
      <v-divider class="mx-1 mt-12" inset vertical></v-divider>
      <v-col cols="4">
        <v-row>
          <v-col
            cols="12"
            class="mx-auto d-flex justify-center subtitle-1 font-weight-black"
          >WLT file</v-col>
          <v-col cols="12" class="pr-10 pl-10 mx-auto d-flex justify-center align-center">
            <v-text-field
              dense
              v-model="form.passwordWLT"
              :append-icon="configForm.passwordWLT.show ? 'mdi-eye' : 'mdi-eye-off'"
              :minlength="configForm.passwordWLT.min"
              :maxlength="configForm.passwordWLT.max"
              :counter="configForm.passwordWLT.max"
              :color="inputStyle"
              :rules="[
                    configForm.passwordWLT.rules.required,
                    configForm.passwordWLT.rules.min,
                    configForm.passwordWLT.rules.max
                  ]"
              :label="configForm.passwordWLT.label"
              :type="configForm.passwordWLT.show ? 'text' : 'password'"
              name="password"
              hint
              @click:append="configForm.passwordWLT.show = !configForm.passwordWLT.show"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- <div class="subtitle-1 font-weight-black">Private key</div> -->
      </v-col>
      <!-- <v-divider class="mt-12" inset vertical></v-divider> -->
      <!-- <v-col col="4" class="mx-auto caption d-flex justify-center">
      </v-col>-->
      <!-- <v-col col="4" class="mx-auto caption d-flex justify-center">
        <div class="subtitle-1 font-weight-black">SiriussIDs</div>
      </v-col>-->
    </v-row>
  </v-col>
</template>
<script>
export default {
  data () {
    return {
      configForm: null,
      form: {
        passwordPk: null
      },
      inputStyle: 'inputStyle'
    }
  },
  components: {
    'account-edit': () => import('@/components/myWalletInfo/AccountEdit'),
    'account-info': () => import('@/components/myWalletInfo/AccountInfo')
  },
  beforeMount () {
    this.configForm = {
      passwordPk: this.$configForm.password(),
      passwordWLT: this.$configForm.password()
    }
  }
}
</script>
