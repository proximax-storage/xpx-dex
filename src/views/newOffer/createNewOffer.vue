<template>
  <v-col class="pa-3">
    <v-row>
      <v-col
        cols="12"
        class="headline font-weight-regular text-left"
        v-bind:class="[typeOfferColorText]"
      >Place your {{ type }} offer</v-col>
    </v-row>
    <!-- mosaicInfo -->
    <v-row>
      <v-col
        sm="7"
        md="7"
        lg="9"
        col="9"
        class="pt-0"
      >
        <template v-if="isMerchingoffer">
          <merching-offert
            :offerMerching="offerMerching"
            :divisibility="configMoneyAsset.precision"
            :nameMosaic="nameMosaic"
            :dataOffertActual="dataOffertActual"
            @actionMerching="actionMerching"
            @continueOffer="continueOffer"
            :typeOfferColor="typeOfferColor"
            :continueLoading="continueLoading"
          />
        </template>
        <template v-if="!dataTxOfferInfo && !isMerchingoffer">
          <v-divider class="pb-2"></v-divider>
          <v-form
            v-model="validOne"
            ref="formOne"
          >
            <v-row>
              <v-col
                cols="12"
                class="pl-12"
              >
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
                        label="Select asset"
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
                        label="Select your asset"
                      ></v-select>
                    </template>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <!-- Montos  -->
                    <v-row>
                      <!-- ammount -->
                      <!-- :disabled="loadingInfo" -->
                      <v-col
                        sm="12"
                        md="4"
                        col="4"
                        lg="4"
                      >
                        <v-text-field
                          name="amountF"
                          ref="amountF"
                          id="amountF"
                          class="pt-0 text-right"
                          @keyup="isValidateQuantityAmount = validateQuantity($event)"
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
                            isValidateQuantityAmount,
                            isValidateAssets
                          ]"
                        ></v-text-field>
                      </v-col>
                      <!-- total consto -->
                      <v-col
                        sm="12"
                        md="4"
                        col="4"
                        lg="4"
                      >
                        <v-text-field
                          class="pt-0 text-align-field-right"
                          name="bidPriceF"
                          ref="bidPriceF"
                          id="bidPriceF"
                          @keyup="isValidateBidPrice = validateQuantity($event)"
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
                            isValidateBidPrice
                          ]"
                        ></v-text-field>
                      </v-col>
                      <!-- Per unit -->
                      <v-col
                        sm="12"
                        md="4"
                        col="4"
                        lg="4"
                        class="pa-0"
                      >
                        <div class="ml-7">
                          <div
                            class="caption "
                            style="color: rgba(0, 0, 0, 0.6);"
                          >
                            Total (XPX):
                          </div>
                          <div class="subtitle-1 font-weight-black">
                            {{ $generalService.amountFormatter(form.totalCost, 6) }} XPX
                          </div>
                          <div
                            v-if="isValidateBalance"
                            class="caption font-italic font-weight-black  red--text"
                          >
                            insufficient balance
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
                      ref="duration"
                      id="duration"
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
          </v-form>
          <v-form
            v-model="valid"
            ref="form"
          >
            <!-- <v-row>
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
            </v-row> -->
            <tx-fee />
            <v-row>
              <v-col
                cols="9"
                class="ma-0 pb-0 mx-auto caption d-flex justify-center align-center"
              >
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
            <!-- <v-row>
              <v-col cols="12" class="ma-0 pa-0 mx-auto caption d-flex justify-center align-center">
                <v-checkbox v-model="form.checkbox" class="pa-0"></v-checkbox>Accept terms and conditions
              </v-col>
            </v-row> -->
          </v-form>
        </template>
        <template v-if="dataTxOfferInfo">
          <congratulations-offer
            :colorText="typeOfferColorText"
            :colorType="typeOfferColor"
            :txOfferInfo="dataTxOfferInfo"
          ></congratulations-offer>
        </template>
        <v-row v-if="!dataTxOfferInfo && !isMerchingoffer">
          <v-col
            cols="5"
            class="ma-0 mx-auto caption d-flex justify-center align-center"
          >
            <custom-button
              @action="action"
              :align="'center'"
              :arrayBtn="getArrayBtn"
            ></custom-button>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        sm="5"
        md="5"
        lg="3"
        col="3"
        class="pt-0"
      >
        <card-assets-market :dataAssets="assetsMarketSet" />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { buildCurrentAccountInfo, decrypt } from '@/services/account-wallet-service'
import { buildAddExchangeOffer, buildExchangeOffer, mosaicDefaultGetValidate } from '@/services/buildOffer-by-type-service'
import { mapGetters, mapMutations } from 'vuex'
import { NodeService } from '@/services/blockchain/node-service'
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
      dataOffertActual: null,
      offerMerching: [],
      nameMosaic: null,
      typeOfferColorText: 'dim--text',
      form: {
        asset: null,
        amount: 0,
        bidPrice: 0,
        totalCost: 0,
        checkbox: false,
        password: null,
        duration: 1
      },
      valid: null,
      validOne: null,
      arrayBtn: null,
      configForm: null,
      configMoney: null,
      inputStyle: 'inputStyle',
      isValidateQuantityAmount: true,
      isValidateBidPrice: true,
      isValidateDuration: true,
      isValidateBalance: null,
      isValidateAssets: true,
      isMerchingoffer: false,
      balanceAssets: 0,
      configDuration: null,
      duration: 0,
      idHex: null,
      typeOffer: null,
      sendingForm: false,
      configMoneyAsset: null,
      hash: null,
      durationValidate: 1
    }
  },
  components: {
    'congratulations-offer': () => import('@/components/shared/CongratulationsOffer'),
    'custom-button': () => import('@/components/shared/Buttons'),
    'card-assets-market': () => import('@/components/shared/CardAssetsMarket'),
    'merching-offert': () => import('@/components/newOffer/MerchingOffer'),
    'tx-fee': () => import('@/components/shared/TxFee')
  },
  beforeMount () {
    this.mountBuildCurrentAccountInfo(this.type)
    this.typeOfferColorFuc(this.type)
    this.configForm = {
      assets: this.$configForm.amount('Asset'),
      amount: this.$configForm.amount(`Amount you will`),
      bidPrice: this.$configForm.amount('Per unit (XPX)'),
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
    continueLoading () {
      return this.sendingForm
    },
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn['place'].disabled =
        !this.form.totalCost > 0 || !this.valid || this.isValidateBalance || !this.validOne
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
    },
    assetsMarketSet () {
      const offerAllMap = this.offerAll.map(i => {
        return {
          'text': i.tableData.text,
          'graphic': i.tableData.graphic,
          'averagePrice': i.tableData.averagePrice
        }
      })
      return offerAllMap
    }
  },
  methods: {
    ...mapMutations('transactionsStore', ['SET_MONITOR_HASH', 'REMOVE_MONITOR_HASH']),
    action (action) {
      switch (action) {
        case 'place':
          if (NodeService.checksBlockTime() && this.valid && !this.sendingForm && this.$generalService.showMsgStatusNode()) {
            let common = decrypt(this.currentAccount.simpleWallet, this.form.password)
            if (common) {
              common = null
              const mosaicAmount = this.$generalService.quantityStringToInt(
                this.form.amount,
                this.configMoneyAsset.precision
              )
              const costTotal = this.form.totalCost
              let returnBuild = null
              this.offerMerching = this.filterMerching(
                this.offerAll,
                this.typeOffer,
                this.idHex,
                mosaicAmount
              )
              if (this.offerMerching.length > 0) {
                this.isMerchingoffer = true
                this.dataOffertActual = {
                  amount: mosaicAmount,
                  costTotal: costTotal,
                  bidPrice: this.$generalService.quantityStringToInt(this.form.bidPrice, 6),
                  type: this.type
                }
              } else {
                returnBuild = buildAddExchangeOffer(
                  this.idHex,
                  mosaicAmount,
                  costTotal,
                  this.typeOffer,
                  this.form.duration
                )

                returnBuild.transaction.version = 4
                this.announceTx(returnBuild, true)
              }
            }
          }
          break
        case 'cancel':
          this.isValidateAssets = true
          this.isValidateBalance = null
          this.isValidateBidPrice = false
          this.$refs.amountF.$el.getElementsByTagName('input')[0].value = '0'
          this.$refs.bidPriceF.$el.getElementsByTagName('input')[0].value = '0'
          this.$refs.form.reset('assest')
          this.form.totalCost = 0
          this.clear()
          break
      }
    },
    actionMerching (data) {
      if (!this.sendingForm) {
        const mosaicAmount = this.$generalService.quantityStringToInt(
          this.form.amount,
          this.configMoneyAsset.precision
        )
        const costTotal = mosaicAmount * data.price
        const mosaicId = this.$blockchainProvider.getMosaicId(this.idHex)
        const type = this.typeOffer === 0 ? 1 : 0
        const returnBuild = buildExchangeOffer(mosaicId, mosaicAmount, costTotal, type, data.owner)
        returnBuild.transaction.version = 2
        this.announceTx(returnBuild)
      }
    },
    announceTx (buildTx, clear = false) {
      let common = decrypt(this.currentAccount.simpleWallet, this.form.password)
      const signedTransaction = this.$blockchainProvider.signedTransaction(
        common.privateKey,
        buildTx.transaction,
        this.currentAccount.simpleWallet.network
      )

      this.hash = signedTransaction.hash
      this.sendingForm = true
      common = null
      if (clear) this.clear()
      const dataMonitorHash = this.$generalService.buildMonitorHash(
        buildTx.action,
        signedTransaction.hash,
        '',
        buildTx.dataRequired
      )
      // this.sendingForm = false
      this.SET_MONITOR_HASH(dataMonitorHash)
      this.$blockchainProvider.announceTx(signedTransaction).subscribe(
        response => { },
        () => {
          this.sendingForm = false
          this.REMOVE_MONITOR_HASH(dataMonitorHash)
        }
      )
    },
    // TODO move to js
    calcPrice (price, amount) {
      return price * amount
    },
    changeAssetId (type) {
      if (type === 'buy') {
        this.changeAssetIdBuy(this.idHex)
      } else {
        this.changeAssetIdSell(this.idHex)
      }
    },

    changeAssetIdBuy (event) {
      this.clearForm()
      this.idHex = event
      if (this.idHex) {
        let data = []
        data = this.mosaicsInfOfferFromIdHex(this.idHex)
        if (data.length > 0) {
          this.nameMosaic = data[0].text
          const divisibility = data[0].mosaicInfo
            ? data[0].mosaicInfo[0].mosaicInfo.properties.divisibility
            : null
          this.configOtherMoneyAsset(divisibility)
        } else {
          this.form.asset = null
          this.nameMosaic = null
        }
      }
    },
    changeAssetIdSell (event) {
      this.clearForm()
      this.idHex = event
      const mosaic = this.mosaicBuild.find(item => item.mosaicIdHex === this.idHex)
      if (mosaic) {
        this.nameMosaic = mosaic.nameMosaic
        this.balanceAssets = mosaic.balanceValidate
        this.configMoneyAsset = mosaic.config
      } else {
        this.nameMosaic = null
        this.configMoneyAsset = this.$configForm.getConfigMoney()
        this.form.asset = null
      }
    },
    changeTypeoffer (event) {
      this.configOtherMoneyAsset()
      this.type = event
      this.changeAssetId(event)
      this.mountBuildCurrentAccountInfo(this.type)
      this.typeOfferColorFuc(this.type)
      this.configForm.amount = this.$configForm.amount(`Amount you will ${this.type}`)
      this.clearForm()
    },
    configOtherMoneyAsset (divisibility) {
      this.configMoneyAsset = divisibility
        ? this.$configForm.getConfigMoney('.', ',', '', '', divisibility, false)
        : this.$configForm.getConfigMoney()
    },
    continueOffer (action) {
      if (action === 'continue') {
        if (!this.sendingForm) {
          const mosaicAmount = this.$generalService.quantityStringToInt(
            this.form.amount,
            this.configMoneyAsset.precision
          )
          const costTotal = this.form.totalCost
          const returnBuild = buildAddExchangeOffer(
            this.idHex,
            mosaicAmount,
            costTotal,
            this.typeOffer,
            this.form.duration
          )
          returnBuild.transaction.version = 4
          this.announceTx(returnBuild)
        }
      } else {
        this.dataTxOfferInfo = false
        this.isMerchingoffer = false
      }
    },
    clearForm () {
      this.isValidateAssets = true
      this.isValidateBalance = null
      this.isValidateBidPrice = false
      this.$refs.amountF.$el.getElementsByTagName('input')[0].value = ''
      this.$refs.bidPriceF.$el.getElementsByTagName('input')[0].value = ''
      this.$refs.form.reset('assest')

      this.$refs.duration.$el.getElementsByTagName('input')[0].value = 1
      this.form.totalCost = 0
    },
    clear () {
      this.$refs.form.reset('password')
    },
    // TODO move to js
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
    // TODO move to js
    calcRangeOffert (priceCalc = 0, priceProm = 0, range = 40) {
      let val = false
      const x = (priceCalc * range) / 100
      const y = priceCalc + x
      const z = priceCalc - x
      if (y >= priceProm && z <= priceProm) {
        val = true
      } else {
        val = false
      }
      return val
    },
    // TODO move to js
    filterMerching (data, type = null, mosaicMerge = null, mosaicAmount = null) {
      let offerts = []
      const typeInvert = type === 0 ? 1 : 0
      const typeName = this.$generalService.verifyTypeOfferName(typeInvert)
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          const amount = this.$generalService.addZerosQuantity(this.configMoneyAsset.precision, 1)
          offerts = element.allOffers[typeName.toLowerCase()].filter(
            x =>
              x.owner.publicKey !== this.currentAccount.publicKey &&
              x.mosaicId.toHex() === mosaicMerge &&
              x.amount.compact() >= mosaicAmount &&
              this.calcRangeOffert(
                this.$generalService.quantityStringToInt(this.form.bidPrice, 6),
                this.calcPrice(x.price, Number(amount))
              )
          )
          if (offerts.length > 0) {
            break
          }
        }
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

      if (this.idHex) {
        if (mosaicDefaultGetValidate(this.idHex)) {
          this.durationValidate = 10
        }
      }
      if (duration !== 0) {
        if (duration <= this.durationValidate) {
          return true
        } else {
          return `You cannot enter the duration greater than ${this.durationValidate}`
        }
      } else {
        return 'Cannot enter duration zero'
      }
    },
    validateQuantity (e) {
      let amount = null
      const amountValue = e.target.value
      try {
        amount = parseFloat(amountValue.split(',').join(''))
      } catch (error) {
        amount = Number(amountValue)
      }
      this.form.totalCost = this.calTotalCost(
        this.form.amount,
        this.form.bidPrice,
        this.configMoneyAsset.precision
      )
      if (this.type === 'sell') {
        if (e.target.name === 'amountF') this.validateBalanceAssets(amount)
      } else {
        this.validateBalanceXpx(this.form.totalCost)
      }
      if (amount === 0) {
        return 'Cannot enter amount zero'
      } else {
        return true
      }
    },
    calTotalCost (amount, perUnit, disivility = 1) {
      const mosaicAmount = this.$generalService.formValue(amount, disivility)
      const priceUnit = this.$generalService.formValue(perUnit, 6)
      return this.$generalService.formValueParse(priceUnit, mosaicAmount)
    },
    validateTxHash (transactions) {
      this.sendingForm = false
      if (this.hash) {
        if (transactions.map(t => t.transactionInfo.hash).find(h => h === this.hash)) {
          this.isMerchingoffer = false
          this.dataTxOfferInfo = { hash: this.hash }
          this.hash = null
        }
      }
    },
    validateForm () {
      return true
    }
  },
  watch: {
    confirmed (transactions) {
      this.validateTxHash(transactions)
    },
    unconfirmedAdded (transactions) {
      this.validateTxHash(transactions)
    },
    confirmedStatus (transactions) {
      const newTransactions = transactions.map(x => {
        return {
          transactionInfo: {
            hash: x
          }
        }
      })
      this.validateTxHash(newTransactions)
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
