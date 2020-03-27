<template>
  <v-col class="pa-3">
    <v-row>
      <v-col
        cols="12"
        class="headline font-weight-regular  text-left"
        v-bind:class="[typeOfferColorText]"
        >Pleace your own offer for {{ type }}
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="7" md="7" lg="9" col="9" class="pt-0">
        <v-divider class="pb-2"></v-divider>
        <v-row>
          <v-col cols="12" class="pl-12">
            <v-form v-model="valid" ref="form">
              <v-row>
                <v-col cols="12">
                  <template v-if="assetsBuy">
                    <v-select
                      class="pt-1"
                      v-model="form.asset"
                      :items="assetsBuy"
                      @change="changeAssetIdBuy($event)"
                      item-text="text"
                      item-value="mosaicIdHex"
                      attach
                      dense
                      :loading="loadingInfo"
                      :rules="[
                        configForm.assets.rules.required,
                        configForm.assets.rules.min,
                        configForm.assets.rules.max
                      ]"
                      :color="inputStyle"
                      label="Select assets"
                    ></v-select>
                  </template>
                  <template v-if="assetsSell">
                    <v-select
                      class="pt-1"
                      v-model="form.asset"
                      :items="assetsSell"
                      @change="changeAssetIdSell($event)"
                      item-text="text"
                      item-value="mosaicIdHex"
                      attach
                      dense
                      :loading="loadingInfo"
                      :rules="[
                        configForm.assets.rules.required,
                        configForm.assets.rules.min,
                        configForm.assets.rules.max
                      ]"
                      :color="inputStyle"
                      label="Select assets"
                    ></v-select>
                  </template>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="4">
                      <v-text-field
                        name="amount"
                        class="pt-0 text-right"
                        @keyup="isValidateQuantityAmount = validateQuantity($event)"
                        v-model="form.amount"
                        v-money="configMoneyAsset"
                        :disabled="loadingInfo"
                        :label="configForm.amount.label"
                        :minlength="configForm.amount.min"
                        :maxlength="configForm.amount.max"
                        :counter="configForm.amount.max"
                        :color="inputStyle"
                        :rules="[
                          configForm.amount.rules.required,
                          configForm.amount.rules.min,
                          configForm.amount.rules.max,
                          isValidateQuantityAmount,
                          isValidateAssets
                        ]"
                      ></v-text-field
                    ></v-col>
                    <v-col cols="4">
                      <v-text-field
                        class="pt-0 text-align-field-right"
                        @keyup="isValidateQuantityBidPrice = validateQuantity($event)"
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
                    </v-col>
                    <v-col class="pa-0" cols="4"
                      ><div class=" ml-7">
                        <div class="caption font-italic font-weight-light">
                          Total to receive from buyer
                        </div>
                        <div class="subtitle-1 font-weight-black ">
                          {{ $generalService.amountFormatter(form.priceForAmount, '', 6) }} XPX
                        </div>
                        <!-- {{ isValidateBalance }} -->
                        <div v-if="isValidateBalance" class="v-text-field__details">
                          <div class="v-messages  error--text" role="alert">
                            <div class="v-messages__wrapper">
                              <div class="v-messages__message">{{ isValidateBalance }}</div>
                            </div>
                          </div>
                        </div>
                      </div></v-col
                    >
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    name="duration"
                    class="pt-0 text-right"
                    @keyup="isValidateDuration = validateDuration($event)"
                    v-model="form.duration"
                    v-money="configDuration"
                    :label="configForm.durationOffer.label"
                    :color="inputStyle"
                    :rules="[configForm.durationOffer.rules.required, isValidateDuration]"
                  ></v-text-field>
                </v-col>
                {{ loadingInfo }}
                {{ assetsBuy }}
                {{ assetsSell }}
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import generalMixins from '../../mixins/general-mixin'
import mosaicMixins from '../../mixins/mosaic-mixin'
import accountMixins from '../../mixins/account-mixin'
import { mapGetters } from 'vuex'
export default {
  mixins: [generalMixins, mosaicMixins, accountMixins],
  data: () => {
    return {
      typeOfferColorText: 'dim--text',
      form: {
        asset: null,
        amount: 0,
        bidPrice: null,
        priceForAmount: 0
      },
      configForm: null,
      configMoney: null,
      inputStyle: 'inputStyle',
      isValidateQuantityAmount: true,
      isValidateQuantityBidPrice: true,
      isValidateDuration: true,
      isValidateBalance: null,
      isValidateAssets: true,
      valid: false,
      balanceAssets: 20000,
      configDuration: null,
      duration: 0,
      idHex: null,
      typeOffer: null,
      configMoneyAsset: null
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'loadingInfo', 'mosaicsInfOfferFromIdHex']),
    ...mapGetters('mosaicExchange', ['exchange', 'dataAssets']),
    ...mapGetters('accountStore', [
      'balanceCurrentAccount',
      'accountsInfo',
      'accountInfoByNameAccount',
      'currentAccount',
      'mosaicBuild'
    ]),
    type () {
      const type = this.dataAssets ? this.dataAssets.form.active : null
      return type
    },
    assetsSell () {
      return this.mosaicBuild
    },
    assetsBuy () {
      // console.log('exchange', this.exchange)
      // console.log('dataAssets', this.dataAssets)
      // console.log('accountStore', this.balanceCurrentAccount)
      // console.log('accountsInfo', this.acountsInfo)
      let asset = null
      // sell son los
      if (this.type === 'buy') {
        asset = this.filtersAssets(this.mosaicsInfOffer)
      }
      return asset
    }
  },
  methods: {
    validateBalanceXpx (amount) {
      this.isValidateBalance = amount > this.balanceCurrentAccount ? 'Insufficient balance' : null
    },
    validateBalanceAssets (amount) {
      this.isValidateAssets =
        this.$generalService.quantityStringToInt(amount, 4) > this.balanceAssets
          ? 'Insufficient balance for this asset'
          : true
    },
    validateDuration (e) {
      const value = e.target.value
      let duration = null
      duration = Number(value)
      if (duration !== 0) {
        if (duration <= 365) {
          return true
        } else {
          return 'You cannot enter the duration greater than 365'
        }
      } else {
        return 'Cannot enter duration zero'
      }
    },
    calcPrice (price, amount) {
      const priceValue = this.$generalService.quantityStringToInt(price, 6)
      const amountValue = this.$generalService.quantityStringToInt(amount, 4)
      return amountValue * priceValue
    },
    changeAssetIdBuy (event) {
      this.idHex = event
      if (this.idHex) {
        const data = this.mosaicsInfOfferFromIdHex(this.idHex)
        const divisibility = data[0].mosaicInfo
          ? data[0].mosaicInfo[0].mosaicInfo.properties.divisibility
          : null
        this.configOtherMoneyAsset(divisibility)
      }
    },
    changeAssetIdSell (event) {
      this.idHex = event
      console.log('idHex', this.idHex)
      console.log('this.mosaicBuild', this.mosaicBuild)
    },
    configOtherMoneyAsset (divisibility) {
      this.configMoneyAsset = divisibility
        ? {
          decimal: '.',
          thousands: ',',
          prefix: '',
          suffix: '',
          precision: divisibility,
          masked: false
        }
        : this.getConfigMoney()
    },
    validateQuantity (e) {
      let amount = null
      const amountValue = e.target.value
      try {
        amount = parseFloat(amountValue.split(',').join(''))
      } catch (error) {
        amount = Number(amountValue)
      }

      this.form.priceForAmount = this.calcPrice(this.form.bidPrice, this.form.amount)

      if (this.type === 'sell') {
        if (e.target.name === 'amount') this.validateBalanceAssets(amount)
      } else {
        this.validateBalanceXpx(this.form.priceForAmount)
      }
      if (amount === 0) {
        return 'Cannot enter amount zero'
      } else {
        return true
      }
    },
    filtersAssets (data) {
      // 286ABCDE88E269AC899D872F2D9CC62E2B8B0126E1F04B49A97EDBE588949806
      let valor = []
      if (JSON.parse(JSON.stringify(data)).length > 0) {
        valor = data.map(item => {
          if (item.mosaicInfo !== null && item.mosaicInfo !== undefined) {
            if (item.mosaicInfo[0].mosaicNames.names.length > 0) {
              item.text = item.mosaicInfo[0].mosaicNames.names[0].name
            } else {
              item.text = item.mosaicIdHex
            }
          } else {
            item.text = item.mosaicIdHex
          }
          return item
        })
      }
      return valor
    },
    typeOfferColorFuc (type) {
      this.typeOffer = type === 'buy' ? 1 : 0
      this.typeOfferColor = type === 'buy' ? 'dim' : 'pin'
      this.typeOfferColorText = `${this.typeOfferColor}--text`
    }
  },
  beforeMount () {
    if (this.type === 'sell') {
      const accountFiltered = this.accountInfoByNameAccount(this.currentAccount.name)
      this.buildCurrentAccountInfo(accountFiltered.accountInfo)
    }
    this.typeOfferColorFuc(this.type)
    this.configForm = this.getConfigForm()
    this.configDuration = this.getConfigMoney({
      decimal: '',
      thousands: '',
      prefix: '',
      suffix: '',
      precision: 0,
      masked: true
    })
    this.configMoney = this.getConfigMoney()
  }
}
</script>
