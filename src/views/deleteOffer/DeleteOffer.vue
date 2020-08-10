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
            <v-row>
              <v-col cols="12" class="ma-0 pa-0 mx-auto caption d-flex justify-center align-center">
                <v-checkbox v-model="form.checkbox" class="pa-0"></v-checkbox>Accept terms and conditions
              </v-col>
            </v-row>
          </v-form>
        </template>
        <template v-if="dataTxOfferInfo">
          <congratulations-offer :colorText="'error--text'" :txOfferInfo="dataTxOfferInfo"></congratulations-offer>
        </template>
        <v-row v-if="!dataTxOfferInfo">
          <v-col cols="5" class="ma-0 mx-auto caption d-flex justify-center align-center">
            <custom-button @action="action" :align="'center'" :arrayBtn="getArrayBtn"></custom-button>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { decrypt } from '@/services/account-wallet-service'
export default {
  data () {
    return {
      form: { password: null, checkbox: false },
      valid: null,
      inputStyle: 'inputStyle',
      configForm: null,
      dataTxOfferInfo: null,
      hash: null,
      arrayBtn: {
        cancel: {
          key: 'cancel',
          action: 'cancel',
          disabled: false,
          color: 'white',
          textColor: 'error--text',

          text: 'Cancel'
        },
        delete: {
          key: 'delete',
          action: 'delete',
          disabled: true,
          color: 'error',
          textColor: 'white--text',
          loading: false,
          text: 'Delete'
        }
      },
      sendingForm: false
    }
  },
  computed: {
    ...mapGetters('mosaicExchange', ['exchangeDelete']),
    ...mapGetters('accountStore', ['currentAccount']),
    ...mapGetters('transactionsStore', ['confirmed', 'unconfirmedAdded', 'status']),
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn.delete.disabled = !this.valid || !this.form.checkbox
      arrayBtn.delete.loading = this.sendingForm
      return arrayBtn
    }
  },
  components: {
    'custom-button': () => import('@/components/shared/Buttons'),
    'congratulations-offer': () => import('@/components/shared/CongratulationsOffer')
  },

  methods: {
    ...mapMutations('transactionsStore', ['SET_MONITOR_HASH', 'REMOVE_MONITOR_HASH']),
    action (action) {
      switch (action) {
        case 'delete':
          if (this.valid && !this.sendingForm) {
            let common = decrypt(this.currentAccount.simpleWallet, this.form.password)
            if (common) {
              if (this.exchangeDelete) {
                const type = this.exchangeDelete.type === 'sell' ? 0 : 1
                const removeExchangeOffer = this.$blockchainProvider.removeExchangeOffer(
                  this.exchangeDelete.exchange.mosaicId,
                  type
                )
                const signedTransaction = this.$blockchainProvider.signedTransaction(
                  common.privateKey,
                  removeExchangeOffer,
                  this.currentAccount.simpleWallet.network
                )
                this.hash = signedTransaction.hash
                this.sendingForm = true
                common = null
                const dataRequired = {
                  dataRequiredDb: [],
                  dataRequiredMosaic: {
                    moisaicsInfo: [
                      {
                        mosaicId: this.exchangeDelete.exchange.mosaicId,
                        mosaicIdHex: this.exchangeDelete.exchange.mosaicId.toHex()
                      }
                    ],
                    dataOffer: {
                      type: type,
                      mosaicIdHex: this.exchangeDelete.exchange.mosaicId.toHex()
                    }
                  }
                }
                const dataMonitorHash = this.$generalService.buildMonitorHash(
                  'removeExchangeOffer',
                  signedTransaction.hash,
                  '',
                  dataRequired
                )
                this.SET_MONITOR_HASH(dataMonitorHash)
                this.$blockchainProvider.announceTx(signedTransaction).subscribe(
                  response => {},
                  () => {
                    this.sendingForm = false
                    this.REMOVE_MONITOR_HASH(dataMonitorHash)
                  }
                )
              }
            }
          }
      }
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
  beforeMount () {
    this.configForm = {
      password: this.$configForm.password()
    }
  },
  watch: {
    confirmed (transactions) {
      this.validateTxHash(transactions)
    },
    unconfirmedAdded (transactions) {
      this.validateTxHash(transactions)
    },
    status (hashs) {
      this.sendingForm = false
    }
  }
}
</script>
