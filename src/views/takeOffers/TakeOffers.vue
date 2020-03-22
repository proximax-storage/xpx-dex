<template>
  <v-col class="pa-3">
    <v-row>
      <v-col
        cols="12"
        class="headline font-weight-regular  text-left"
        v-bind:class="[typeOfferColorText]"
      >
        Take this offer - {{ type }} transaction
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" class="">
        <v-divider class="pb-5"></v-divider>
        <v-row>
          <v-col cols="5" class="">
            <v-row>
              <v-col cols="12" class="subtitle-1 pt-0 font-weight-regular  text-left primary--text">
                My debit transaction</v-col
              >
              <div class="ma-2 ml-7 mx-auto">
                <div class="caption font-italic font-weight-light">
                  Amount you will send to selle
                </div>
                <div class="caption font-weight-black ">
                  <!-- {{exchange}} -->
                  {{ $generalService.amountFormatter(form.priceForAmount, '', 6) }} XPX
                </div>
              </div>
              <div class="ma-2 ml-7 mx-auto">
                <div class="caption font-italic font-weight-light mx-auto">BID Price</div>
                <div class="caption font-weight-black mx-auto">{{ exchange.price }} pxp</div>
              </div>
            </v-row>
          </v-col>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-col cols="5" class="">
            <v-row>
              <v-col cols="12" class="subtitle-1 pt-0 font-weight-regular  text-left primary--text">
                My credit transaction</v-col
              >
              <div class="ma-2 ml-7">
                <div class="caption font-italic font-weight-light">Asset selectd</div>
                <div class="caption font-weight-black ">{{ nameMosaicInfo }}</div>
              </div>
              <div class="ma-2 ml-7">
                <div class="caption font-italic font-weight-light">
                  Amount you will receave from seller
                </div>
                <div class="caption font-weight-black ">
                  <v-form v-model="valid" ref="form"></v-form>
                  <v-text-field
                    @keyup="validateQuantityAmount()"
                    v-model="form.amount"
                    v-money="dataAssets.configMoney"
                    :label="configForm.amount.label"
                    :minlength="configForm.amount.min"
                    :maxlength="configForm.amount.max"
                    :counter="configForm.amount.max"
                    :color="inputStyle"
                    :rules="[
                      configForm.amount.rules.required,
                      configForm.amount.rules.min,
                      configForm.amount.rules.max,
                      isValidateQuantityAmount
                    ]"
                  ></v-text-field>
                </div>
              </div>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" class="mx-auto caption d-flex justify-center align-center">
            <p>
              Disclosure: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis varius
              mauris, non aliquet libero. Pellentesque est eros. pharetra non finibus et, fermentum
              sed felis. Duis portito. purus a suscipit consequat
            </p>
          </v-col>
          <v-col cols="10" class="ma-0 mx-auto caption d-flex justify-center align-center">
            this transaction will have a fee: 0.002020 XPX</v-col
          >
        </v-row>
        <v-row>
          <v-col cols="10" class="ma-0 mx-auto caption d-flex justify-center align-center">
            password</v-col
          >
        </v-row>
        <v-row>
          <v-col cols="10" class="ma-0 mx-auto caption d-flex justify-center align-center">
            buttons</v-col
          >
        </v-row>
      </v-col>
      <v-col cols="4"></v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
import generalMixins from '../../mixins/general-mixin'
export default {
  mixins: [generalMixins],
  data: () => ({
    form: {
      amount: null,
      priceForAmount: null
    },
    inputStyle: 'inputStyle',
    isValidateQuantityAmount: true,
    valid: null,
    data: null,
    typeOfferColor: null,
    typeOfferColorText: null,
    type: null,
    mosaic: null,
    theme: 'light',
    configForm: null
  }),
  methods: {
    calcPrice (price, amount) {
      return amount * price
    },
    validateQuantityAmount () {
      let amount = null
      try {
        amount = parseFloat(this.form.amount.split(',').join(''))
      } catch (error) {
        amount = Number(this.form.amount)
      }
      this.form.priceForAmount = this.calcPrice(
        this.exchange.price,
        this.$generalService.quantityStringToInt(amount, this.dataAssets.configMoney.precision)
      )
      const amountx = parseFloat(this.dataAssets.form.amount.split(',').join(''))
      if (amount !== 0) {
        if (amount <= amountx) {
          this.isValidateQuantityAmount = true
        } else {
          this.isValidateQuantityAmount = `Cannot enter amount greater than ${this.$generalService.amountFormatter(
            this.exchange.amount.compact(),
            '',
            this.dataAssets.configMoney.precision
          )}`
        }
      } else {
        this.isValidateQuantityAmount = 'Cannot enter amount zero'
      }
    },
    typeOfferColorFuc (type) {
      this.type = type
      this.typeOfferColor = type === 'buy' ? 'dim' : 'pin'
      this.typeOfferColorText = `${this.typeOfferColor}--text`
    },
    nameMosaic (form) {
      let nameMosaics = null
      if (form) {
        this.mosaic = this.mosaicsInfOfferFromIdHex(form.asset)
        if (this.mosaic[0].mosaicInfo !== null && this.mosaic[0].mosaicInfo !== undefined) {
          nameMosaics =
            this.mosaic[0].mosaicInfo[0].mosaicNames.names.length > 0
              ? this.mosaic[0].mosaicInfo[0].mosaicNames.names[0].name
              : this.mosaic[0].text
        }
      }
      return nameMosaics
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOfferFromIdHex']),
    ...mapGetters('mosaicExchange', ['exchange', 'dataAssets']),
    nameMosaicInfo () {
      let nameMosaic = null
      nameMosaic = this.dataAssets ? this.nameMosaic(this.dataAssets.form) : ''
      return nameMosaic
    }
  },
  beforeMount () {
    this.typeOfferColorFuc(this.dataAssets.form.active)
    this.configForm = this.getConfigForm()
    this.form.amount = this.exchange.amount.compact()
    this.form.priceForAmount = this.exchange.priceForAmount
  }
}
</script>
