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
                        name="totalCostF"
                        ref="totalCostF"
                        id="totalCostF"
                        @keyup="isValidateQuantityTotalCost = validateQuantity($event)"
                        v-model="form.totalCost"
                        v-money="configMoney"
                        :label="configForm.totalCost.label"
                        :minlength="configForm.totalCost.min"
                        :maxlength="configForm.totalCost.max"
                        :counter="configForm.totalCost.max"
                        :color="inputStyle"
                        :rules="[
                            configForm.totalCost.rules.required,
                            configForm.totalCost.rules.min,
                            configForm.totalCost.rules.max,
                            isValidateQuantityTotalCost,
                            isValidateBalance
                          ]"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="12" md="4" col="4" lg="4" class="pa-0">
                      <div class="ml-7">
                        <div class="caption font-italic font-weight-light">Per Unit:</div>
                        <div
                          class="subtitle-1 font-weight-black"
                        >{{ $generalService.amountFormatter(form.bidPrice,6) }} XPX</div>
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
import { buildAddExchangeOffer, buildExchangeOffer } from '@/services/buildOffer-by-type-service'
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
        bidPrice: 0,
        totalCost: 0,
        checkbox: false,
        password: null
      },
      valid: null,
      arrayBtn: null,
      configForm: null,
      configMoney: null,
      inputStyle: 'inputStyle',
      isValidateQuantityAmount: true,
      isValidateQuantityTotalCost: true,
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
      totalCost: this.$configForm.amount('Total cost (XPX)'),
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
    ...mapGetters('offersStore', ['offerAll']),
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
            const mosaicAmount = this.$generalService.quantityStringToInt(
              this.form.amount,
              this.configMoneyAsset.precision
            )
            const costTotal = this.$generalService.quantityStringToInt(this.form.totalCost, 6)
            let returnBuild = null
            const offerMerching = this.filterMerching(
              this.offerAll,
              this.typeOffer,
              this.idHex,
              mosaicAmount
            )
            if (offerMerching.length > 0) {
              const mosaicId = this.$blockchainProvider.getMosaicId(this.idHex)
              const type = this.typeOffer === 0 ? 1 : 0
              returnBuild = buildExchangeOffer(
                mosaicId,
                mosaicAmount,
                costTotal,
                type,
                offerMerching[0].owner
              )
            } else {
              returnBuild = buildAddExchangeOffer(
                this.idHex,
                mosaicAmount,
                costTotal,
                this.typeOffer,
                this.form.duration
              )
            }
            let common = decrypt(this.currentAccount.simpleWallet, this.form.password)
            if (common) {
              const signedTransaction = this.$blockchainProvider.signedTransaction(
                common.privateKey,
                returnBuild.transaction,
                this.currentAccount.simpleWallet.network
              )

              this.hash = signedTransaction.hash
              this.sendingForm = true
              common = null
              this.clear()
              const dataMonitorHash = this.$generalService.buildMonitorHash(
                returnBuild.action,
                signedTransaction.hash,
                '',
                returnBuild.dataRequired
              )
              //  ##########################################fin
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
        if (duration <= 1) {
          return true
        } else {
          return 'You cannot enter the duration greater than 1 '
        }
      } else {
        return 'Cannot enter duration zero'
      }
    },
    calcPrice (price, amount) {
      console.log(`PRINCE: ${price} / AMOUNT: ${amount}`)
      return price / amount
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
      const costTotal = this.$generalService.quantityStringToInt(this.form.totalCost, 6)
      if (this.type === 'sell') {
        if (e.target.name === 'amountF') this.validateBalanceAssets(amount)
      } else {
        this.validateBalanceXpx(costTotal)
      }

      const mosaicAmount = this.$generalService.quantityStringToInt(
        this.form.amount,
        this.configMoneyAsset.precision
      )
      this.form.bidPrice = this.calcPrice(costTotal, mosaicAmount)
      console.log('this.form.bidPrice', this.form.bidPrice)
      console.log('multilicar :', mosaicAmount * this.form.bidPrice)
      if (amount === 0) {
        return 'Cannot enter amount zero'
      } else {
        return true
      }
    },
    filtersAssets (data) {
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
    filterMerching (data, type = null, mosaicMerge = null, mosaicAmount = null) {
      let offerts = []
      const typeInvert = type === 0 ? 1 : 0
      const typeName = this.$generalService.verifyTypeOfferName(typeInvert)
      if (data[0]) {
        offerts = data[0].allOffers[typeName.toLowerCase()].filter(
          x =>
            x.mosaicId.toHex() === mosaicMerge &&
            x.amount.compact() >= mosaicAmount &&
            this.form.bidPrice === this.$generalService.formatterPrice(x.price)
        )
      }
      return offerts
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
      this.isValidateQuantityTotalCost = false
      this.$refs.amountF.$el.getElementsByTagName('input')[0].value = ''
      this.$refs.totalCostF.$el.getElementsByTagName('input')[0].value = ''
      this.$refs.form.reset('assest')
      this.form.totalCost = 0
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
