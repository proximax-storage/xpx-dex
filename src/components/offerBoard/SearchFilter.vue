<template>
  <v-row>
    <v-col cols="12" class="pb-0 pt-0">
      <v-form v-model="valid" ref="form">
        <v-card elevation="0" class="mb-3 d-flex" color="leve">
          <v-card-text class="pt-1 pb-1">
            <v-row>
              <v-col cols="1" class="d-flex justify-center align-center pa-0 ">
                <img
                  style="vertical-align: middle"
                  :src="require(`@/assets/img/${theme}/icon-search.svg`)"
                  width="35"
              /></v-col>
              <v-col cols="5" class="pa-0">
                <v-row>
                  <v-col cols="5" class="pt-3 pb-0">
                    <v-text-field
                      background-color="leveint"
                      dense
                      outlined
                      reverse
                      @keyup="validateQuantityAmount()"
                      v-model="form.amount"
                      v-money="configMoneyAsset"
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
                    ></v-text-field> </v-col
                  ><v-col cols="1" class=" pt-3 d-flex justify-center align-center">
                    <img
                      style="vertical-align: middle"
                      :src="require(`@/assets/img/${theme}/icon-and.svg`)"
                      width="20"
                      height="20"/></v-col
                  ><v-col clcols="5" class="pt-3 pb-0">
                    <v-text-field
                      dense
                      outlined
                      reverse
                      background-color="leveint"
                      @keyup="validateQuantityBidPrice()"
                      v-model="form.bidPrice"
                      v-money="configMoney"
                      :label="configForm.bidPrice.label"
                      :minlength="configForm.bidPrice.min"
                      :maxlength="configForm.bidPrice.max"
                      :counter="configForm.bidPrice.max"
                      :color="inputStyle"
                      :rules="[
                        configForm.bidPrice.rules.required,
                        configForm.bidPrice.rules.min,
                        configForm.bidPrice.rules.max,
                        isValidateQuantityBidPrice
                      ]"
                    ></v-text-field>
                  </v-col> </v-row
              ></v-col>
              <v-col cols="6" class="pa-0 pr-5 d-flex justify-center align-center">
                <custom-buttons
                  class="pb-4"
                  @action="lookAgain"
                  :align="'end'"
                  :arrayBtn="getArrayBtn[0]"
                ></custom-buttons>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
export default {
  mixins: [generalMixins],
  props: ['dataForm'],
  data: () => ({
    form: {
      asset: null,
      amount: null,
      bidPrice: null,
      active: null
    },
    inputStyle: 'inputStyle',
    configMoney: null,
    theme: 'light',
    configForm: null,
    configMoneyAsset: null,
    isValidateQuantityAmount: true,
    isValidateQuantityBidPrice: true,
    arrayBtn: true,
    valid: null
  }),
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons')
  },
  computed: {
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn[0]['lookAgain'].disabled =
        !this.valid ||
        this.sendingForm ||
        !this.validateZero([this.form.amount, this.form.bidPrice])
      arrayBtn[0]['lookAgain'].loading = this.sendingForm
      return arrayBtn
    }
  },
  methods: {
    lookAgain () {
      this.$emit('lookAgainf', this.form)
    },
    validateQuantityAmount () {
      let amount = null
      try {
        amount = parseFloat(this.form.amount.split(',').join(''))
      } catch (error) {
        amount = Number(this.form.amount)
      }
      if (amount === 0) {
        this.isValidateQuantityAmount = 'Cannot enter amount zero'
      } else {
        this.isValidateQuantityAmount = true
      }
    },
    validateQuantityBidPrice () {
      let amount = null
      try {
        amount = parseFloat(this.form.bidPrice.split(',').join(''))
      } catch (error) {
        amount = Number(this.form.bidPrice)
      }
      if (amount === 0) {
        this.isValidateQuantityBidPrice = 'Cannot enter amount zero'
      } else {
        this.isValidateQuantityBidPrice = true
      }
    }
  },
  beforeMount () {
    this.configMoney = this.getConfigMoney()
    this.configForm = this.getConfigForm()
    this.arrayBtn = [
      {
        lookAgain: this.typeButtons().lookAgain
      }
    ]
  },
  created () {
    if (this.dataForm) {
      this.configMoneyAsset = this.dataForm.configMoney
      this.form.amount = this.dataForm.form.amount
      this.form.bidPrice = this.dataForm.form.bidPrice
    } else {
      this.$router.push({ path: '/searchOfferts' })
    }
  }
}
</script>
