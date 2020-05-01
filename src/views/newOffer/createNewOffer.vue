<template>
  <v-col class="pa-3">
    <v-row>
      <v-col
        cols="12"
        class="headline font-weight-regular text-left"
        v-bind:class="[typeOfferColorText]"
      >Pleace your own offer for {{ type }}</v-col>
    </v-row>
    <!-- mosaicInfo -->
    <v-row>
      <v-col sm="7" md="7" lg="9" col="9" class="pt-0">
        <template v-if="!dataTxOfferInfo">
          <v-divider class="pb-2"></v-divider>

          <v-row>
            <v-col cols="12" class="pl-12">
              <v-row>
                <v-col cols="12">
                  <template v-if="!type || !isAsset">
                    <v-select
                      class="pt-1"
                      v-model="selectTypeOffer"
                      :items="arrayTypeOffer"
                      @change="changeTypeoffer($event)"
                      item-text="text"
                      item-value="value"
                      attach
                      dense
                      :rules="[
                          configForm.assets.rules.required,
                          configForm.assets.rules.min,
                          configForm.assets.rules.max
                        ]"
                      :color="inputStyle"
                      label="Offer type"
                    ></v-select>
                  </template>
                </v-col>
                <v-col cols="12">
                  <template v-if="type === 'buy'">
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
                  <template v-if="type === 'sell'">
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
                      label="Select your assets"
                    ></v-select>
                  </template>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col sm="12" md="4" col="4" lg="4">
                      <v-text-field
                        name="amountF"
                        ref="amountF"
                        id="amountF"
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
                      ></v-text-field>
                    </v-col>
                    <v-col sm="12" md="4" col="4" lg="4">
                      <v-text-field
                        class="pt-0 text-align-field-right"
                        name="bidPriceF"
                        ref="bidPriceF"
                        id="bidPriceF"
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
                    <v-col sm="12" md="4" col="4" lg="4" class="pa-0">
                      <div class="ml-7">
                        <div class="caption font-italic font-weight-light">
                          <template v-if="type === 'sell'">Total to receive from buyer</template>
                          <template v-if="type === 'buy'">Total to send to seller</template>
                        </div>
                        <div
                          class="subtitle-1 font-weight-black"
                        >{{ $generalService.amountFormatter(form.priceForAmount,6) }} XPX</div>
                        <div v-if="isValidateBalance" class="v-text-field__details">
                          <div class="v-messages error--text" role="alert">
                            <div class="v-messages__wrapper">
                              <div class="v-messages__message">{{ isValidateBalance }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
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
              </v-row>
            </v-col>
          </v-row>
          <v-form v-model="valid" ref="form">
            <v-row>
              <v-col
                sm="10"
                md="10"
                col="10"
                lg="10"
                class="mx-auto caption d-flex justify-center align-center"
              >
                <p>
                  Disclosure: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis
                  varius mauris, non aliquet libero. Pellentesque est eros. pharetra non finibus et,
                  fermentum sed felis. Duis portito. purus a suscipit consequat
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="10"
                class="ma-0 mx-auto body-2 d-flex justify-center align-center"
              >This transaction will have a fee: 0.002020 XPX</v-col>
            </v-row>
            <v-row>
              <v-col cols="9" class="ma-0 pb-0 mx-auto caption d-flex justify-center align-center">
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
            <v-row>
              <v-col cols="12" class="ma-0 pa-0 mx-auto caption d-flex justify-center align-center">
                <v-checkbox v-model="form.checkbox" class="pa-0"></v-checkbox>Accept terms and conditions
              </v-col>
            </v-row>
          </v-form>
        </template>
        <template v-if="dataTxOfferInfo">
          <congratulations-offer
            :colorText="typeOfferColorText"
            :colorType="typeOfferColor"
            :txOfferInfo="dataTxOfferInfo"
          ></congratulations-offer>
        </template>
        <v-row v-if="!dataTxOfferInfo">
          <v-col cols="5" class="ma-0 mx-auto caption d-flex justify-center align-center">
            <custom-button @action="action" :align="'center'" :arrayBtn="getArrayBtn"></custom-button>
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="5" md="5" lg="3" col="3" class="pt-0">
        <card-assets-market :dataAssets="dataAssets" />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { buildCurrentAccountInfo, decrypt } from '@/services/account-wallet-service'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data: () => {
    return {
      selectTypeOffer: null,
      arrayTypeOffer: [
        {
          text: 'Buy',
          value: 'buy'
        },
        {
          text: 'Sell',
          value: 'sell'
        }
      ],
      dataTxOfferInfo: null,
      typeOfferColorText: 'dim--text',
      form: {
        asset: null,
        amount: 0,
        bidPrice: null,
        priceForAmount: 0,
        checkbox: false,
        password: null
      },
      valid: null,
      arrayBtn: null,
      configForm: null,
      configMoney: null,
      inputStyle: 'inputStyle',
      isValidateQuantityAmount: true,
      isValidateQuantityBidPrice: true,
      isValidateDuration: true,
      isValidateBalance: null,
      isValidateAssets: true,
      balanceAssets: 0,
      configDuration: null,
      duration: 0,
      idHex: null,
      typeOffer: null,
      sendingForm: false,
      configMoneyAsset: null,
      addExchangeOffer: null,
      dataMosaics: null,
      hash: null
    }
  },
  components: {
    'congratulations-offer': () => import('@/components/shared/CongratulationsOffer'),
    'custom-button': () => import('@/components/shared/Buttons'),
    'card-assets-market': () => import('@/components/shared/CardAssetsMarket')
  },
  beforeMount () {
    this.mountBuildCurrentAccountInfo(this.type)
    this.typeOfferColorFuc(this.type)
    this.configForm = {
      assets: this.$configForm.amount('Asset'),
      amount: this.$configForm.amount(),
      bidPrice: this.$configForm.amount('BID Price (XPX)'),
      durationOffer: this.$configForm.namespace('Duration (number of days)'),
      password: this.$configForm.password()
    }
    this.configDuration = this.$configForm.getConfigMoney('', '', '', '', 0, true)
    this.configMoney = this.$configForm.getConfigMoney()
    this.arrayBtn = {
      cancel: this.$configForm.buildButton('Cancel', 'cancel', 'cancel', 'primary', 'white--text'),
      place: this.$configForm.buildButton('Place', 'place', 'place', 'primary', 'white--text')
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'loadingInfo', 'mosaicsInfOfferFromIdHex']),
    ...mapGetters('mosaicExchange', ['exchange', 'dataAssets']),
    ...mapGetters('transactionsStore', ['confirmed', 'unconfirmedAdded', 'status']),
    ...mapGetters('accountStore', [
      'balanceCurrentAccount',
      'accountsInfo',
      'accountInfoByNameAccount',
      'currentAccount',
      'mosaicBuild'
    ]),
    isAsset () {
      let value = null
      if (this.dataAssets === null) return (value = false)
      value = 'mosaicInfo' in this.dataAssets
      return value
    },
    type: {
      get () {
        const type = this.dataAssets ? this.dataAssets.form.active : null
        return type
      },
      set (newtType) {
        this.$store.commit('mosaicExchange/SET_DATA_ASSETS', { form: { active: newtType } })
      }
    },
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn['place'].disabled = !this.valid || !this.form.checkbox || this.isValidateBalance
      arrayBtn['place'].loading = this.sendingForm
      arrayBtn['place'].color = this.type === null ? 'white' : this.typeOfferColor
      arrayBtn['place'].textColor = 'white--text'
      arrayBtn['place'].textColor = this.type === null ? 'primary--text' : 'white--text'
      return arrayBtn
    },
    assetsSell () {
      let asset = []
      if (this.type === 'sell') {
        asset = this.mosaicBuild
      }
      return asset
    },
    assetsBuy () {
      let asset = []
      if (this.type === 'buy') {
        asset = this.filtersAssets(this.mosaicsInfOffer)
      }
      return asset
    }
  },
  methods: {
    ...mapMutations('transactionsStore', ['SET_MONITOR_HASH', 'REMOVE_MONITOR_HASH']),
    action (action) {
      switch (action) {
        case 'place':
          if (this.valid && !this.sendingForm) {
            this.addExchangeOffer = null
            const mosaicAmount = this.$generalService.quantityStringToInt(
              this.form.amount,
              this.configMoneyAsset.precision
            )
            /* let cost = 0
            console.log('this.typeOffer', this.typeOffer)
            if (this.typeOffer === 1) {
              cost = this.form.priceForAmount
            } else {
              cost = this.$generalService.quantityStringToInt(this.form.bidPrice, 6)
            }
            console.log('costs', cost) */
            const id = this.$blockchainProvider.getMosaicId(this.idHex)
            // const duration = Number(this.form.duration)
            const addExchangeOffer = this.$blockchainProvider.addExchangeOffer(
              id,
              mosaicAmount,
              this.form.priceForAmount,
              this.typeOffer,
              Number(500)
            )

            // this.dataMosaics.push(
            //   {
            //     mosaicId: this.$blockchainProvider.getMosaicId(this.idHex),
            //     mosaicIdHex: this.idHex
            //   },
            //   { type: this.typeOffer }
            // )
            this.dataMosaics = {
              moisaicsInfo: [
                {
                  mosaicId: this.$blockchainProvider.getMosaicId(this.idHex),
                  mosaicIdHex: this.idHex
                }
              ],
              dataOffer: {
                type: this.typeOffer,
                mosaicIdHex: this.idHex
              }
            }

            let common = decrypt(this.currentAccount.simpleWallet, this.form.password)
            if (common) {
              const signedTransaction = this.$blockchainProvider.signedTransaction(
                common.privateKey,
                addExchangeOffer,
                this.currentAccount.simpleWallet.network
              )

              this.hash = signedTransaction.hash
              this.sendingForm = true
              common = null
              this.clear()
              const dataMonitorHash = this.$generalService.buildMonitorHash(
                'insertMoisaicsInfo',
                signedTransaction.hash,
                '',
                this.dataMosaics
              )
              this.SET_MONITOR_HASH(dataMonitorHash)
              this.$blockchainProvider.announceTx(signedTransaction).subscribe(
                response => console.log(response),
                error => {
                  console.error(error)
                  this.sendingForm = false
                  this.REMOVE_MONITOR_HASH(dataMonitorHash)
                }
              )
            }
          }
      }
    },
    clear () {
      this.$refs.form.reset('password')
    },
    validateBalanceXpx (amount) {
      this.isValidateBalance = amount > this.balanceCurrentAccount ? 'Insufficient balance' : null
    },
    validateBalanceAssets (amount) {
      this.isValidateAssets =
        this.$generalService.quantityStringToInt(amount, this.configMoneyAsset.precision) >
        this.balanceAssets
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
      return this.$generalService.quantityStringToIntMath(Number(amount) * Number(price), 6)
    },
    changeAssetIdBuy (event) {
      this.clearForm()
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
      this.clearForm()
      this.idHex = event
      const mosaic = this.mosaicBuild.find(item => item.mosaicIdHex === this.idHex)
      if (mosaic) {
        this.balanceAssets = mosaic.balanceValidate
        this.configMoneyAsset = mosaic.config
      } else {
        this.configMoneyAsset = this.$configForm.getConfigMoney()
      }
    },
    changeTypeoffer (event) {
      this.configOtherMoneyAsset()
      this.type = event
      this.mountBuildCurrentAccountInfo(this.type)
      this.typeOfferColorFuc(this.type)
      this.clearForm()
    },
    configOtherMoneyAsset (divisibility) {
      this.configMoneyAsset = divisibility
        ? this.$configForm.getConfigMoney('.', ',', '', '', divisibility, false)
        : this.$configForm.getConfigMoney()
    },
    validateQuantity (e) {
      let amount = null
      const amountValue = e.target.value
      try {
        amount = parseFloat(amountValue.split(',').join(''))
      } catch (error) {
        amount = Number(amountValue)
      }

      this.form.priceForAmount = this.calcPrice(
        this.form.bidPrice.split(',').join(''),
        this.form.amount.split(',').join('')
      )
      console.log('this.form.priceForAmount', this.form.priceForAmount)
      if (this.type === 'sell') {
        if (e.target.name === 'amountF') this.validateBalanceAssets(amount)
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
      if (type === 'buy') {
        this.typeOffer = 1
        this.typeOfferColor = 'dim'
      }
      if (type === 'sell') {
        this.typeOffer = 0
        this.typeOfferColor = 'pin'
      }
      if (type === null) {
        this.typeOffer = 2
        this.typeOfferColor = 'primary'
      }
      this.typeOfferColorText = `${this.typeOfferColor}--text`
    },
    mountBuildCurrentAccountInfo (type = null) {
      if (type === 'sell') {
        const accountFiltered = this.accountInfoByNameAccount(this.currentAccount.name)
        buildCurrentAccountInfo(accountFiltered.accountInfo)
      }
    },
    clearForm () {
      this.isValidateAssets = true
      this.isValidateBalance = null
      this.isValidateQuantityBidPrice = false
      this.$refs.amountF.$el.getElementsByTagName('input')[0].value = ''
      this.$refs.bidPriceF.$el.getElementsByTagName('input')[0].value = ''
      this.$refs.form.reset('assest')
      this.form.priceForAmount = 0
    },
    validateTxHash (transactions) {
      this.sendingForm = false
      if (this.hash) {
        if (transactions.map(t => t.transactionInfo.hash).find(h => h === this.hash)) {
          this.dataTxOfferInfo = { hash: this.hash }
          this.hash = null
        }
      }
    }
  },
  watch: {
    confirmed (transactions) {
      this.validateTxHash(transactions)
    },
    unconfirmedAdded (transactions) {
      this.validateTxHash(transactions)
    },
    accountsInfo (newAccountsInfo) {
      this.mountBuildCurrentAccountInfo(this.type)
    },
    status (hashs) {
      this.sendingForm = false
    }
  }
}
</script>
