<template>
  <v-col class="pa-3">
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">Delete offer</v-col>
    </v-row>
    <v-row>
      <v-col sm="7" md="7" lg="9" col="9" class="pt-0">
        <v-divider class="pb-5"></v-divider>
        <!-- {{exchangeDelete}} -->
        <template v-if="!dataTxOfferInfo">
          <v-form v-model="valid" ref="form">
            <v-row>
              <v-col cols="5">
                <v-row>
                  <v-col
                    cols="12"
                    class="subtitle-1 pt-0 font-weight-regular text-left primary--text"
                  >Quantitys</v-col>
                  <div class="ma-2 ml-7 mx-auto">
                    <div class="caption font-italic font-weight-light">Initial</div>
                    <div class="caption font-weight-black">{{exchangeDelete.initialQuantity}}</div>
                  </div>
                  <div class="ma-2 ml-7 mx-auto">
                    <div class="caption font-italic font-weight-light mx-auto">Available</div>
                    <div
                      class="caption font-weight-black mx-auto"
                    >{{exchangeDelete.quantityAvailable}}</div>
                  </div>
                </v-row>
              </v-col>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-col cols="5">
                <v-row>
                  <v-col
                    cols="12"
                    class="subtitle-1 pt-0 font-weight-regular text-left primary--text"
                  >Costs</v-col>
                  <div class="ma-2 ml-7 mx-auto">
                    <div class="caption font-italic font-weight-light">Price (XPX)</div>
                    <div class="caption font-weight-black">{{exchangeDelete.price}}</div>
                  </div>
                  <div class="ma-2 ml-7 mx-auto">
                    <div class="caption font-italic font-weight-light">Total (XPX)</div>
                    <div class="caption font-weight-black">{{exchangeDelete.initialCost}}</div>
                  </div>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" class="mx-auto caption d-flex justify-center align-center">
                <p>
                  Disclosure: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis
                  varius mauris, non aliquet libero. Pellentesque est eros. pharetra non finibus et,
                  fermentum sed felis. Duis portito. purus a suscipit consequat
                </p>
              </v-col>
              <v-col
                cols="10"
                class="ma-0 mx-auto caption d-flex justify-center align-center"
              >this transaction will have a fee: 0.002020 XPX</v-col>
            </v-row>

            <v-row>
              <v-col cols="5" class="ma-0 mx-auto caption d-flex justify-center align-center">
                <v-text-field
                  dense
                  v-model="form.password"
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
            </v-row>
          </v-form>
        </template>
        <template v-if="dataTxOfferInfo">
          <!-- <congratulations-offer :colorText="typeOfferColorText" :txOfferInfo="dataTxOfferInfo"></congratulations-offer> -->
        </template>
        <v-row v-if="!dataTxOfferInfo">
          {{getArrayBtn[0]}}
          <v-col cols="5" class="ma-0 mx-auto caption d-flex justify-center align-center">
            <custom-button @action="action" :align="'center'" :arrayBtn="getArrayBtn"></custom-button>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
import generalMixins from '../../mixins/general-mixin'

export default {
  mixins: [generalMixins],
  data () {
    return {
      form: { password: null },
      valid: null,
      inputStyle: 'inputStyle',
      configForm: null,
      dataTxOfferInfo: null,
      arrayBtn: {
        cancel: {
          key: 'cancel',
          action: 'cancel',
          disabled: false,
          color: 'white',
          textColor: 'error--text',
          loading: false,
          text: 'Cancel'
        },
        delete: {
          key: 'delete',
          action: 'delete',
          disabled: true,
          color: 'error',
          textColor: 'white--text',
          text: 'Delete'
        }
      }
    }
  },
  computed: {
    ...mapGetters('mosaicExchange', ['exchangeDelete']),
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      console.log(arrayBtn)
      arrayBtn.delete.disabled = !this.valid
      arrayBtn.delete.loading = this.sendingForm
      return arrayBtn
    }
  },
  components: {
    'custom-button': () => import('@/components/shared/Buttons')
  },

  methods: {
    action (item) {}
  },
  beforeMount () {
    this.configForm = this.getConfigForm()
  }
}
</script>
