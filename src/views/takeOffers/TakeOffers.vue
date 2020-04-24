<template>
  <v-col class="pa-3">
    <v-row>
      <v-col
        cols="12"
        class="headline font-weight-regular text-left"
        v-bind:class="[typeOfferColorText]"
      >Take this offer - {{ dataAssets.form.active }} transaction</v-col>
    </v-row>
    <v-row>
      <v-col sm="7" md="7" lg="9" col="9" class="pt-0">
        <v-divider class="pb-5"></v-divider>

        <template v-if="!dataTxOfferInfo">
          <v-form v-model="valid" ref="form">
            <v-row>
              <v-col cols="5" class>
                <v-row>
                  <v-col
                    cols="12"
                    class="subtitle-1 pt-0 font-weight-regular text-left primary--text"
                  >My debit transaction</v-col>
                  <div class="ma-2 ml-7 mx-auto">
                    <div
                      class="caption font-italic font-weight-light"
                    >Quantity you will send to selle</div>
                    <div
                      class="caption font-weight-black"
                    >{{ $generalService.amountFormatter(form.priceForAmount, 6) }} XPX</div>
                  </div>
                  <div class="ma-2 ml-7 mx-auto">
                    <div class="caption font-italic font-weight-light mx-auto">BID Price</div>
                    <div class="caption font-weight-black mx-auto">{{ exchange.price }} pxp</div>
                  </div>
                </v-row>
              </v-col>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-col cols="5" class>
                <v-row>
                  <v-col
                    cols="12"
                    class="subtitle-1 pt-0 font-weight-regular text-left primary--text"
                  >My credit transaction</v-col>
                  <div class="ma-2 ml-7">
                    <div class="caption font-italic font-weight-light">Asset selectd</div>
                    <div class="caption font-weight-black">{{ nameMosaicInfo }}</div>
                  </div>
                  <div class="ma-2 ml-7">
                    <div
                      class="caption font-italic font-weight-light"
                    >Amount you will receave from seller</div>
                    <div class="caption font-weight-black">
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
          <congratulations-offer :colorText="typeOfferColorText" :txOfferInfo="dataTxOfferInfo"></congratulations-offer>
        </template>
        <v-row v-if="!dataTxOfferInfo">
          <v-col cols="5" class="ma-0 mx-auto caption d-flex justify-center align-center">
            <custom-buttons @action="action" :align="'center'" :arrayBtn="getArrayBtn"></custom-buttons>
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
import { mapGetters, mapState } from 'vuex'
export default {
  data: () => ({
    form: {
      amount: null,
      priceForAmount: null,
      password: null
    },
    dataTxOfferInfo: null,
    sendingForm: false,
    inputStyle: 'inputStyle',
    isValidateQuantityAmount: true,
    valid: null,
    data: null,
    arrayBtn: null,
    typeOfferColor: null,
    typeOfferColorText: null,
    type: null,
    mosaic: null,
    theme: 'light',
    configForm: null,
    hash: null,
    exchangeOfferDb: null
  }),
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons'),
    'congratulations-offer': () => import('@/components/shared/CongratulationsOffer'),
    'card-assets-market': () => import('@/components/shared/CardAssetsMarket')
  },

  beforeMount () {
    if (this.dataAssets) {
      this.typeOfferColorFuc(this.dataAssets.form.active)
      this.form.amount = this.exchange.amount.compact()
      this.form.priceForAmount = this.exchange.priceForAmount
    }
    this.configForm = {
      amount: this.$configForm.amount('Quantity'),
      password: this.$configForm.password()
    }
    // this.arrayBtn = [
    //   {
    //     cancel: this.typeButtons().cancel,
    //     buy: this.typeButtons().buy
    //   }
    // ]

    this.arrayBtn = {
      cancel: this.$configForm.buildButton('Cancel', 'cancel', 'cancel', 'primary', 'white--text'),
      place: this.$configForm.buildButton('Place', 'place', 'place', 'primary', 'white--text')
    }
  },
  methods: {
    action (action) {
      switch (action) {
        case 'place':
          if (this.valid && !this.sendingForm) {
            this.exchangeOffer = null
            const mosaicAmount = this.$generalService.quantityStringToInt(
              this.form.amount,
              this.dataAssets.configMoney.precision
            )
            const exchangeOffer = this.$blockchainProvider.exchangeOffer(
              this.exchange.mosaicId,
              mosaicAmount,
              this.form.priceForAmount,
              this.type,
              this.exchange.owner
            )
            this.exchangeOfferDb = this.$blockchainProvider.exchangeOfferDb(
              this.exchange.mosaicId,
              mosaicAmount,
              this.form.priceForAmount,
              this.type,
              this.exchange.owner
            )
            let common = this.decrypt(this.currentAccount.simpleWallet, this.form.password)
            if (common) {
              const signedTransaction = this.$blockchainProvider.signedTransaction(
                common.privateKey,
                exchangeOffer
              )
              this.hash = signedTransaction.hash
              this.sendingForm = true
              common = null
              this.clear()
              this.$blockchainProvider.announceTx(signedTransaction).subscribe(
                x => {},
                err => {
                  if (err) this.sendingForm = false
                }
              )
            }
          }
          break
        case 'cancel':
          // this.showPrivateKey = !this.showPrivateKey
          break
      }
    },
    clear () {
      this.$refs.form.reset('password')
      // this.$refs['password'].reset()
    },
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
      const amountValue = this.$generalService.quantityStringToInt(
        amount,
        this.dataAssets.configMoney.precision
      )
      this.form.priceForAmount = this.calcPrice(this.exchange.price, amountValue)
      const amountx = this.exchange.amount.compact()
      if (amountValue !== 0) {
        if (amountValue <= amountx) {
          this.isValidateQuantityAmount = true
        } else {
          this.isValidateQuantityAmount = `Cannot enter amount greater than ${this.$generalService.amountFormatter(
            amountx,
            this.dataAssets.configMoney.precision
          )}`
        }
      } else {
        this.isValidateQuantityAmount = 'Cannot enter amount zero'
      }
    },
    typeOfferColorFuc (type) {
      this.type = type === 'buy' ? 1 : 0
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
  watch: {
    statusTx (newstatusTx, old) {
      this.sendingForm = false
      if (this.hash) {
        if (newstatusTx.hash === this.hash) {
          if (newstatusTx.type === 'unconfirmed' || newstatusTx.type === 'confirmed') {
            this.dataTxOfferInfo = { hash: this.hash }
            this.hash = null
            // console.log('exchangeOfferDb statusTx', this.exchangeOfferDb)
            this.$store.dispatch('socketDbStore/insertExecuteOffers', {
              io: this.$socket,
              data: this.exchangeOfferDb
            })
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOfferFromIdHex']),
    ...mapGetters('mosaicExchange', ['exchange', 'dataAssets']),
    ...mapGetters('socketBcStore', ['statusTx']),

    ...mapState('accountStore', ['currentAccount']),
    nameMosaicInfo () {
      let nameMosaic = null
      nameMosaic = this.dataAssets ? this.nameMosaic(this.dataAssets.form) : ''
      return nameMosaic
    },
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn['place'].disabled = !this.valid
      arrayBtn['place'].loading = this.sendingForm
      return arrayBtn
    }
  }
}
</script>
